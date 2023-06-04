import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LatLngZoneDAO } from './schemas/LatLngZone.schema';
import { ZoneDataDAO } from './schemas/ZoneData.schema';
import { ElectricityMapsHistoryData } from './types/ElectricityMapsData';
import { Estimate } from './types/Estimate';

@Injectable()
export class EstimateService {
    constructor(
        @InjectModel(LatLngZoneDAO.name)
        private latLngZoneDAO: Model<LatLngZoneDAO>,
        @InjectModel(ZoneDataDAO.name)
        private zoneDataDAO: Model<ZoneDataDAO>
    ) {}
    public async getEstimate(latitude: number, longitude: number): Promise<Estimate> {
        const carbonEmissionsEstimate = await this.getCarbonEmissionsEstimate(latitude, longitude);

        return {
            estimatedCarbonIntensity: carbonEmissionsEstimate.value,
            estimatedCostPerKWh: {
                currency: 'EUR',
                value: 0,
            },
            zone: carbonEmissionsEstimate.zone,
        };
    }

    private async getCarbonEmissionsEstimate(
        latitude: number,
        longitude: number
    ): Promise<{ value: number; zone: string }> {
        const latitudeRounded = Math.round(latitude);
        const longitudeRounded = Math.round(longitude);

        const latLngZone = await this.latLngZoneDAO
            .findOne({ latitude: latitudeRounded, longitude: longitudeRounded })
            .lean();

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

    private async getCarbonEmissionsEstimateFromElectricityMaps(
        latitude: number,
        longitude: number
    ): Promise<ElectricityMapsHistoryData> {
        // todo call electricity maps api
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

    private async saveLatLngZoneMappingToDb(
        latitude: number,
        longitude: number,
        zone: string
    ): Promise<void> {
        await this.latLngZoneDAO.create({
            latitude: Math.round(latitude),
            longitude: Math.round(longitude),
            zone,
        });
    }

    private async saveNewZoneDataToDb(data: ElectricityMapsHistoryData): Promise<void> {
        const newestDataInDb = await this.zoneDataDAO
            .findOne({ zone: data.zone })
            .sort({ datetime: -1 })
            .limit(1)
            .lean();

        if (!newestDataInDb) {
            const writeResult = await this.zoneDataDAO.bulkWrite(
                data.history.map((historyData) => ({
                    insertOne: {
                        document: historyData,
                    },
                }))
            );
            if (!writeResult.isOk) throw new Error('Could not save new zone data to db');
            return;
        }

        const newestDataInDbDate = newestDataInDb.datetime;

        const dataToSave = data.history.filter(
            (historyData) => new Date(historyData.datetime) > new Date(newestDataInDbDate)
        );

        const writeResult = await this.zoneDataDAO.bulkWrite(
            dataToSave.map((historyData) => ({
                insertOne: {
                    document: historyData,
                },
            }))
        );

        if (!writeResult.isOk) throw new Error('Could not save new zone data to db');
    }
}
