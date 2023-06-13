import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';

import { DatadogLogger } from '../logging/DatadogLogger';
import { LatLngZoneDAO } from './schemas/LatLngZone.schema';
import { ZoneDataDAO } from './schemas/ZoneData.schema';
import { ZoneElectricityPriceDAO } from './schemas/ZoneElectricityPrice.schema';
import { ElectricityMapsHistoryData } from './types/ElectricityMapsData';
import { Estimate } from './types/Estimate';

@Injectable({ scope: Scope.REQUEST })
export class EstimateService {
    constructor(
        @InjectModel(LatLngZoneDAO.name)
        private latLngZoneDAO: Model<LatLngZoneDAO>,
        @InjectModel(ZoneDataDAO.name)
        private readonly zoneDataDAO: Model<ZoneDataDAO>,
        @InjectModel(ZoneElectricityPriceDAO.name)
        private readonly zoneElectricityPriceDAO: Model<ZoneElectricityPriceDAO>,
        private readonly config: ConfigService,
        private readonly httpService: HttpService,
        private readonly Logger: DatadogLogger,
        @Inject(REQUEST)
        private readonly request: Request
    ) {}
    public async getEstimate(latitude: number, longitude: number): Promise<Estimate> {
        this.Logger.debug('Getting estimate', this.getMeta(), { latitude, longitude });

        const { latitudeRounded, longitudeRounded } = this.roundLatLng(latitude, longitude);

        this.Logger.debug('Rounded LatLng', this.getMeta(), { latitudeRounded, longitudeRounded });

        const carbonEmissionsEstimate = await this.getCarbonEmissionsEstimate(
            latitudeRounded,
            longitudeRounded
        );

        const electricityPrice = await this.getElectricityPrice(carbonEmissionsEstimate.zone);

        return {
            estimatedCarbonIntensity: carbonEmissionsEstimate.value,
            estimatedCostPerKWh: {
                currency: 'EUR',
                value: electricityPrice,
            },
            zone: carbonEmissionsEstimate.zone,
        };
    }

    private async getCarbonEmissionsEstimate(
        latitude: number,
        longitude: number
    ): Promise<{ value: number; zone: string }> {
        this.Logger.debug('Getting carbon estimate', this.getMeta());

        const latLngZone = await this.latLngZoneDAO.findOne({ latitude, longitude }).lean();

        this.Logger.debug(`Found zone: ${latLngZone?.zone}`, this.getMeta());

        if (!latLngZone) {
            const data = await this.getCarbonEmissionsEstimateFromElectricityMaps(
                latitude,
                longitude
            );

            if (!data)
                throw new HttpException(
                    'Could not find zone for coordinates',
                    HttpStatus.NOT_FOUND
                );

            await this.saveLatLngZoneMappingToDb(latitude, longitude, data.zone);
            await this.saveNewZoneDataToDb(data);

            return {
                value:
                    data.history.reduce((acc, curr) => acc + curr.carbonIntensity, 0) /
                    data.history.length,
                zone: data.zone,
            };
        }

        const zoneData = await this.zoneDataDAO
            .find({ zone: latLngZone.zone })
            .sort({ datetime: -1 })
            .limit(100)
            .lean();

        if (!zoneData.length)
            throw new HttpException('Could not get zone data', HttpStatus.NOT_FOUND);

        // todo if data is older than x days (f.e. 3), also get new data from electricity maps

        const averageCarbonIntensity =
            zoneData.reduce((acc, curr) => acc + curr.carbonIntensity, 0) / zoneData.length;

        return {
            value: averageCarbonIntensity,
            zone: latLngZone.zone,
        };
    }

    private async getElectricityPrice(zone: string): Promise<number> {
        const priceInZone = await this.zoneElectricityPriceDAO.findOne({
            zone: zone.substring(0, 2),
        });
        if (!priceInZone) return 0;
        return priceInZone.kWhPriceInEuro;
    }

    private async getCarbonEmissionsEstimateFromElectricityMaps(
        latitude: number,
        longitude: number
    ): Promise<ElectricityMapsHistoryData> {
        const shouldMock = this.config.get('electricityMaps.shouldBeMocked');

        this.Logger.debug('Getting data from Electricity Maps', this.getMeta(), {
            latitude,
            longitude,
            shouldMock,
        });

        if (shouldMock) {
            return {
                zone: 'test',
                history: [
                    {
                        zone: 'test',
                        carbonIntensity: 9999,
                        datetime: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        createdAt: new Date().toISOString(),
                        emissionFactorType: 'test',
                        isEstimated: false,
                        estimationMethod: null,
                    },
                ],
            };
        }

        const baseUrl = this.config.get('electricityMaps.url');
        const url = `${baseUrl}/carbon-intensity/history?lat=${latitude}&lon=${longitude}`;
        const headers = {
            'X-BLOBR-KEY': this.config.get('ELECTRICITY_MAPS_APIKEY'),
        };

        this.Logger.debug('Calling Electricity Maps', this.getMeta(), { url, headers });

        try {
            const res = await this.httpService.axiosRef.get<ElectricityMapsHistoryData>(url, {
                headers,
            });

            this.Logger.debug('Got response from Electricity Maps', this.getMeta(), {
                data: res.data,
                status: res.status,
                statusText: res.statusText,
            });

            // todo validate response body
            return res.data;
        } catch (error) {
            this.Logger.error('Failed to fetch data from ElectricityMaps');
            throw new HttpException(
                'Failed to fetch data from ElectricityMaps',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    private async saveLatLngZoneMappingToDb(
        latitude: number,
        longitude: number,
        zone: string
    ): Promise<void> {
        this.Logger.debug('Saving LatLngZone mapping to db', this.getMeta(), {
            latitude,
            longitude,
            zone,
        });

        await this.latLngZoneDAO.create({
            latitude: Math.round(latitude),
            longitude: Math.round(longitude),
            zone,
        });
    }

    private async saveNewZoneDataToDb(data: ElectricityMapsHistoryData): Promise<void> {
        this.Logger.debug('Saving new zone data to db', this.getMeta(), { data });

        const newestDataInDb = await this.zoneDataDAO
            .findOne({ zone: data.zone })
            .sort({ datetime: -1 })
            .limit(1)
            .lean();

        if (!newestDataInDb) {
            this.Logger.debug('No data in db yet, saving all data', this.getMeta(), { data });

            const writeResult = await this.zoneDataDAO.bulkWrite(
                data.history.map((historyData) => ({
                    insertOne: {
                        document: historyData,
                    },
                }))
            );

            this.Logger.debug('Write zoneData to db result', this.getMeta(), { writeResult });

            if (!writeResult.isOk)
                throw new HttpException(
                    'Could not save new zone data to db',
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            return;
        }

        const newestDataInDbDate = newestDataInDb.datetime;

        const dataToSave = data.history.filter(
            (historyData) => new Date(historyData.datetime) > new Date(newestDataInDbDate)
        );

        if (dataToSave.length === 0) {
            this.Logger.debug('No new data to save', this.getMeta());
            return;
        }

        this.Logger.debug(
            `Saving ${dataToSave.length} out of ${data.history.length} new data points to db`,
            this.getMeta(),
            { dataToSave }
        );

        const writeResult = await this.zoneDataDAO.bulkWrite(
            dataToSave.map((historyData) => ({
                insertOne: {
                    document: historyData,
                },
            }))
        );

        this.Logger.debug('Write zoneData to db result', this.getMeta(), { writeResult });

        if (!writeResult.isOk)
            throw new HttpException(
                'Could not save new zone data to db',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
    }

    private roundLatLng(
        latitude: number,
        longitude: number
    ): { latitudeRounded: number; longitudeRounded: number } {
        let latitudeRounded = Math.round(latitude);
        let longitudeRounded = Math.round(longitude);

        if (latitudeRounded % 2 === 1) latitudeRounded -= 1;
        if (longitudeRounded % 2 === 1) longitudeRounded -= 1;

        return { latitudeRounded, longitudeRounded };
    }

    private getMeta() {
        if (this.config.get('environment') === 'development') return '';
        return { flowId: this.request.headers['x-flow-id'] };
    }
}
