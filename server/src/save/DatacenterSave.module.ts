import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LoggerModule } from '../logging/logger.module';
import { DatacenterSaveController } from './DatacenterSave.controller';
import { DatacenterSaveDAO, DatacenterSaveSchema } from './DatacenterSave.schema';
import { DatacenterSaveService } from './DatacenterSave.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: DatacenterSaveDAO.name, schema: DatacenterSaveSchema }]),
        LoggerModule,
    ],
    controllers: [DatacenterSaveController],
    providers: [DatacenterSaveService],
})
export class DatacenterSaveModule {}
