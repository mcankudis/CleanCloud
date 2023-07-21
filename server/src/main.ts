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
    app.use(
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css ',
                ],
                imgSrc: [
                    "'self'",
                    'a.tile.openstreetmap.org',
                    'b.tile.openstreetmap.org',
                    'c.tile.openstreetmap.org',
                ],
                connectSrc: ["'self'", 'https://api.github.com'],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
                mediaSrc: ["'none'"],
                frameSrc: ["'none'"],
                workerSrc: ["'none'"],
                childSrc: ["'none'"],
                formAction: ["'none'"],
                upgradeInsecureRequests: [],
            },
        })
    );

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
