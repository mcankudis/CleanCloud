import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ZoneData } from '../types/ZoneData';

export type ZoneDataDocument = HydratedDocument<ZoneData>;

@Schema({ timestamps: true, collection: 'ZoneData' })
export class ZoneDataDAO implements ZoneData {
    @Prop({ index: true })
    zone: string;
    @Prop()
    carbonIntensity: number;
    @Prop({ index: true })
    datetime: Date;
    @Prop()
    createdAt: Date;
    @Prop()
    updatedAt: Date;
}

export const ZoneDataSchema = SchemaFactory.createForClass(ZoneDataDAO);
