import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ZoneElectricityPrice } from '../types/ZoneElectricityPrice';

export type ZoneElectricityPriceDocument = HydratedDocument<ZoneElectricityPrice>;

@Schema({ timestamps: true, collection: 'ZoneElectricityPrices' })
export class ZoneElectricityPriceDAO implements ZoneElectricityPrice {
    @Prop({ index: true })
    zone: string;
    @Prop()
    kWhPriceInEuro: number;
    @Prop()
    createdAt: Date;
    @Prop()
    updatedAt: Date;
}

export const ZoneElectricityPriceSchema = SchemaFactory.createForClass(ZoneElectricityPriceDAO);
