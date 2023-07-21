import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { configuration } from './config/configuration';
import { EstimateModule } from './estimate/Estimate.module';
import { FlowIdMiddleware } from './logging/flow-id.middleware';
import { LoggerModule } from './logging/logger.module';
import { RequestLoggerMiddleware } from './logging/request-logger.middleware';
import { DatacenterSaveModule } from './save/DatacenterSave.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                return {
                    uri: configService.get('DB_CONNECTION_STRING'),
                };
            },
            inject: [ConfigService],
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../..', 'client/dist'),
            exclude: [
                'https://a.tile.openstreetmap.org/*',
                'https://b.tile.openstreetmap.org/*',
                'https://c.tile.openstreetmap.org/',
            ],
        }),
        ScheduleModule.forRoot(),
        EstimateModule,
        DatacenterSaveModule,
        LoggerModule,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes('*');
        consumer.apply(FlowIdMiddleware).forRoutes('*');
    }
}
