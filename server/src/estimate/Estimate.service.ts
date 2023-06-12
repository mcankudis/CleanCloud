import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Scope } from '@nestjs/common';
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
        private readonly logger: DatadogLogger,
        @Inject(REQUEST)
        private readonly request: Request
    ) {}
    public async getEstimate(latitude: number, longitude: number): Promise<Estimate> {
        this.logger.debug('Getting estimate', this.getMeta(), { latitude, longitude });

        const { latitudeRounded, longitudeRounded } = this.roundLatLng(latitude, longitude);

        this.logger.debug('Rounded LatLng', this.getMeta(), { latitudeRounded, longitudeRounded });

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
        this.logger.debug('Getting carbon estimate', this.getMeta());

        const latLngZone = await this.latLngZoneDAO.findOne({ latitude, longitude }).lean();

        this.logger.debug(`Found zone: ${latLngZone?.zone}`, this.getMeta());

        if (!latLngZone) {
            const data = await this.getCarbonEmissionsEstimateFromElectricityMaps(
                latitude,
                longitude
            );

            if (!data) throw new Error('Could not get data');

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

        this.logger.debug('Getting data from Electricity Maps', this.getMeta(), {
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

        this.logger.debug('Calling Electricity Maps', this.getMeta(), { url, headers });

        const res = await this.httpService.axiosRef.get<ElectricityMapsHistoryData>(url, {
            headers,
        });

        this.logger.debug('Got response from Electricity Maps', this.getMeta(), {
            data: res.data,
            status: res.status,
            statusText: res.statusText,
        });

        if (res.status !== 200) {
            this.logger.error('Failed to fetch data from ElectricityMaps');
            throw new Error('Failed to fetch data from ElectricityMaps');
        }

        // todo validate response body

        return res.data;
    }

    private async saveLatLngZoneMappingToDb(
        latitude: number,
        longitude: number,
        zone: string
    ): Promise<void> {
        this.logger.debug('Saving LatLngZone mapping to db', this.getMeta(), {
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
        this.logger.debug('Saving new zone data to db', this.getMeta(), { data });

        const newestDataInDb = await this.zoneDataDAO
            .findOne({ zone: data.zone })
            .sort({ datetime: -1 })
            .limit(1)
            .lean();

        if (!newestDataInDb) {
            this.logger.debug('No data in db yet, saving all data', this.getMeta(), { data });

            const writeResult = await this.zoneDataDAO.bulkWrite(
                data.history.map((historyData) => ({
                    insertOne: {
                        document: historyData,
                    },
                }))
            );

            this.logger.debug('Write zoneData to db result', this.getMeta(), { writeResult });

            if (!writeResult.isOk) throw new Error('Could not save new zone data to db');
            return;
        }

        const newestDataInDbDate = newestDataInDb.datetime;

        const dataToSave = data.history.filter(
            (historyData) => new Date(historyData.datetime) > new Date(newestDataInDbDate)
        );

        if (dataToSave.length === 0) {
            this.logger.debug('No new data to save', this.getMeta());
            return;
        }

        this.logger.debug(
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

        this.logger.debug('Write zoneData to db result', this.getMeta(), { writeResult });

        if (!writeResult.isOk) throw new Error('Could not save new zone data to db');
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
