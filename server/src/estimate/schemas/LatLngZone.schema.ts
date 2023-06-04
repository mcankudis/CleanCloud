import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LatLngZone } from '../types/LatLngZone';

export type LatLngZoneDocument = HydratedDocument<LatLngZone>;

@Schema({ timestamps: true, collection: 'LatLngZoneMap' })
export class LatLngZoneDAO {
    @Prop()
    latitude: number;
    @Prop()
    longitude: number;
    @Prop({ index: true })
    zone: string;
}

export const LatLngZoneSchema = SchemaFactory.createForClass(LatLngZoneDAO);

LatLngZoneSchema.index({ latitude: 1, longitude: 1 });
