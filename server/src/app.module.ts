import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { EstimateModule } from './estimate/Estimate.module';
import { LoggerModule } from './logging/logger.module';
import { RequestLoggerMiddleware } from './logging/request-logger.middleware';

@Module({
    imports: [
        ConfigModule.forRoot({
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
        EstimateModule,
        LoggerModule,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    }
}
