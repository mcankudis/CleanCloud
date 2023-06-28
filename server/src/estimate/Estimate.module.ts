import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '../logging/logger.module';
import { EstimateController } from './Estimate.controller';
import { EstimateService } from './Estimate.service';
import { LatLngZoneDAO, LatLngZoneSchema } from './schemas/LatLngZone.schema';
import { ZoneDataDAO, ZoneDataSchema } from './schemas/ZoneData.schema';
import {
    ZoneElectricityPriceDAO,
    ZoneElectricityPriceSchema,
} from './schemas/ZoneElectricityPrice.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: LatLngZoneDAO.name, schema: LatLngZoneSchema },
            { name: ZoneDataDAO.name, schema: ZoneDataSchema },
            { name: ZoneElectricityPriceDAO.name, schema: ZoneElectricityPriceSchema },
        ]),
        HttpModule,
        LoggerModule,
    ],
    controllers: [EstimateController],
    providers: [EstimateService],
    exports: [EstimateService],
})
export class EstimateModule {}
