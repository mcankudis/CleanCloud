import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DatacenterSave } from './DatacenterSave';

export type DatacenterSaveDocument = HydratedDocument<DatacenterSave>;

@Schema({ timestamps: true, collection: 'Saves' })
export class DatacenterSaveDAO implements DatacenterSave {
    @Prop({ index: true })
    id: string;
    @Prop({ type: Array })
    positions: {
        name?: string;
        latitude: number;
        longitude: number;
        projectedEnergyConsumptionInKWh?: number;
    }[];
    @Prop()
    lastAccess: Date;
    @Prop()
    createdAt: Date;
    @Prop()
    updatedAt: Date;
}

export const DatacenterSaveSchema = SchemaFactory.createForClass(DatacenterSaveDAO);
