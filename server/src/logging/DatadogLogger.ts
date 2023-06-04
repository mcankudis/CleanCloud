import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger as WinstonLogger, createLogger, format, transports } from 'winston';

@Injectable()
export class DatadogLogger extends ConsoleLogger {
    private Logger: WinstonLogger;
    private stage: string;
    constructor(private readonly config: ConfigService) {
        super();
        this.stage = process.env.NODE_ENV ?? this.config?.get('ENVIRONMENT') ?? 'production';

        const key = this.config?.get('DATADOG_APIKEY');

        const httpTransportOptions = {
            host: 'http-intake.logs.datadoghq.com',
            path: `/api/v2/logs?dd-api-key=${key}&ddsource=nodejs&service=CleanCloud`,
            ssl: true,
        };

        this.Logger = createLogger({
            level: 'debug',
            exitOnError: false,
            format: format.json(),
            transports: [new transports.Http(httpTransportOptions)],
        });
    }

    public log(message: any, ...optionalParams: any[]) {
        if (this.stage === 'production') {
            this.Logger.info(message, optionalParams);
        }
        super.log(message, ...optionalParams);
    }

    public error(message: any, ...optionalParams: any[]) {
        if (this.stage === 'production') {
            this.Logger.error(message, optionalParams);
        }
        super.error(message, ...optionalParams);
    }

    public warn(message: any, ...optionalParams: any[]) {
        if (this.stage === 'production') {
            this.Logger.warn(message, optionalParams);
        }
        super.warn(message, ...optionalParams);
    }

    public debug(message: any, ...optionalParams: any[]) {
        if (this.stage === 'production') {
            this.Logger.debug(message, optionalParams);
        }
        super.debug(message, ...optionalParams);
    }

    public verbose(message: any, ...optionalParams: any[]) {
        if (this.stage === 'production') {
            this.Logger.verbose(message, optionalParams);
        }
        super.verbose(message, ...optionalParams);
    }
}
