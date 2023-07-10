import { Estimate } from '../estimate/types/Estimate';

export interface DatacenterSavePosition {
    name?: string;
    latitude: number;
    longitude: number;
    projectedEnergyConsumptionInKWh?: number;
}

export type DatacenterSavePositionResponse = DatacenterSavePosition & { baseEstimate?: Estimate };

export interface DatacenterSave {
    id: string;
    positions: DatacenterSavePosition[];
    lastAccess: Date;
}

export type DatacenterSaveCreateRequest = Pick<DatacenterSave, 'positions'>;
export type DatacenterSaveUpdateRequest = Pick<DatacenterSave, 'id' | 'positions'>;
export type DatacenterSaveFindResponse = Pick<DatacenterSave, 'id' | 'positions'>;
