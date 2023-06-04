import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

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
    const port = configService.get('PORT') ?? 3545;

    await app.listen(port);
    logger.log(`App running in ${mode} mode on port: ${port}`);
}

bootstrap();
