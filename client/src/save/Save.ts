export interface SavePosition {
    latitude: number;
    longitude: number;
    projectedEnergyConsumptionInKWh?: number;
}

export interface Save {
    id: string;
    positions: SavePosition[];
}

export type CreateSaveRequest = Omit<Save, 'id'>;

export type UpdateSaveRequest = Save;
