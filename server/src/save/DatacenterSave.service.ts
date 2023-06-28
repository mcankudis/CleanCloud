import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';

import { DatadogLogger } from '../logging/DatadogLogger';
import {
    DatacenterSave,
    DatacenterSaveCreateRequest,
    DatacenterSaveFindResponse,
    DatacenterSaveUpdateRequest,
} from './DatacenterSave';
import { DatacenterSaveDAO } from './DatacenterSave.schema';

const getRandomString = () => {
    return randomUUID();
};

@Injectable()
export class DatacenterSaveService {
    constructor(
        @InjectModel(DatacenterSaveDAO.name)
        private datacenterSaveDAO: Model<DatacenterSaveDAO>,
        private readonly Logger: DatadogLogger
    ) {}

    public async getDatacenterSaveById(id: string): Promise<DatacenterSaveFindResponse | null> {
        const save = await this.datacenterSaveDAO.findOne({ id });

        this.Logger.debug(`Save ${id} requested, found in db: ${save?._id}`);

        if (save) {
            this.Logger.debug(`Updating lastAccess on save ${id}`);

            save.lastAccess = new Date();
            await save.save();

            this.Logger.debug(`Updated lastAccess on save ${id}`);
        }

        return save;
    }

    public async createDatacenterSave(
        datacenterSave: DatacenterSaveCreateRequest
    ): Promise<DatacenterSave> {
        this.Logger.debug('Creating DatacenterSave', datacenterSave);

        const data: DatacenterSave = {
            id: getRandomString(),
            lastAccess: new Date(),
            positions: datacenterSave.positions,
        };

        const res = await this.datacenterSaveDAO.create(data);

        this.Logger.debug(`Created save`, res);

        return res;
    }

    public async updateDatacenterSave(update: DatacenterSaveUpdateRequest) {
        this.Logger.debug('Updating DatacenterSave', update);

        const save = await this.datacenterSaveDAO.findOne({ id: update.id });

        if (!save) return null;

        save.positions = update.positions;
        const res = await save.save();

        this.Logger.debug('Updated DatacenterSave', res);

        return res;
    }

    @Cron(CronExpression.EVERY_DAY_AT_NOON)
    public async cleanupOldSaves() {
        this.Logger.debug('Deleting old saves');

        const date30daysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const res = await this.datacenterSaveDAO.deleteMany({ lastAccess: { $lt: date30daysAgo } });

        this.Logger.debug('Deleted old saves', res);
    }
}
