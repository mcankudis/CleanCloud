import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

@Injectable({ scope: Scope.REQUEST })
export class DatacenterSaveService {
    constructor(
        @InjectModel(DatacenterSaveDAO.name)
        private datacenterSaveDAO: Model<DatacenterSaveDAO>,
        private readonly Logger: DatadogLogger
    ) {}
    // todo logging
    // todo validation

    public async getDatacenterSaveById(id: string): Promise<DatacenterSaveFindResponse | null> {
        const save = await this.datacenterSaveDAO.findOne({ id });

        if (save) {
            save.lastAccess = new Date();
            await save.save();
        }

        // todo update lastAccess

        // todo ask for password if password-protected

        return save;
    }

    public async createDatacenterSave(
        datacenterSave: DatacenterSaveCreateRequest
    ): Promise<DatacenterSave> {
        this.Logger.debug('Creating DatacenterSave', {
            ...datacenterSave,
            password: datacenterSave.password ? '*****' : undefined,
        });

        const passwordHash = datacenterSave.password; // todo encrypt

        const data: DatacenterSave = {
            id: getRandomString(),
            lastAccess: new Date(),
            positions: datacenterSave.positions,
            password: passwordHash,
        };
        const res = await this.datacenterSaveDAO.create(data);

        return res;
    }

    public async updateDatacenterSave(update: DatacenterSaveUpdateRequest) {
        const save = await this.datacenterSaveDAO.findOne({ id: update.id });
        // todo check password if needed

        if (!save) return null;

        save.positions = update.positions;
        // todo update password

        save.save();

        return save;
    }

    // todo cronjob for cleaning up old saves
}
