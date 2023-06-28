import { Estimate } from '../estimate/Estimate';

export interface SavePosition {
    latitude: number;
    longitude: number;
    projectedEnergyConsumptionInKWh?: number;
    baseEstimate?: Estimate;
}

export interface Save {
    id: string;
    positions: SavePosition[];
}

export type CreateSaveRequest = Omit<Save, 'id'>;

export type UpdateSaveRequest = Save;
