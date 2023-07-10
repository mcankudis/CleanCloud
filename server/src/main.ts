import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { DatadogLogger } from './logging/DatadogLogger';

const mode = process.env.NODE_ENV ?? 'development';
const config = mode === 'production' ? {} : { cors: true };

async function bootstrap() {
    const app = await NestFactory.create(AppModule, config);
    app.use(helmet());

    const logger = app.get(DatadogLogger);
    app.useLogger(logger);

    const configService = app.get(ConfigService);

    logger.log(`Starting app with config`, {
        environment: configService.get('environment'),
        electricityMaps: configService.get('electricityMaps'),
        db: configService.get('db'),
        datadog: configService.get('datadog'),
    });

    app.useGlobalPipes(new ValidationPipe());

    const port = configService.get('PORT') ?? 3545;

    await app.listen(port);
    logger.log(`App running in ${mode} mode on port: ${port}`);
}

bootstrap();
