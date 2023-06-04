import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatadogLogger } from './DatadogLogger';

@Module({
    imports: [ConfigModule.forRoot()],
    providers: [DatadogLogger],
    exports: [DatadogLogger],
})
export class LoggerModule {}
