import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DatacenterSave } from './DatacenterSave';

export type DatacenterSaveDocument = HydratedDocument<DatacenterSave>;

@Schema({ timestamps: true })
export class DatacenterSaveDAO implements DatacenterSave {
    @Prop({ index: true })
    id: string;
    @Prop()
    password?: string;
    @Prop({ type: Array })
    positions: { latitude: number; longitude: number }[];
    @Prop()
    lastAccess: Date;
    @Prop()
    createdAt: Date;
    @Prop()
    updatedAt: Date;
}

export const DatacenterSaveSchema = SchemaFactory.createForClass(DatacenterSaveDAO);
