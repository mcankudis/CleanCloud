export interface DatacenterSave {
    id: string;
    positions: { latitude: number; longitude: number }[];
    lastAccess: Date;
}

// todo validation
export type DatacenterSaveCreateRequest = Pick<DatacenterSave, 'positions'>;
export type DatacenterSaveUpdateRequest = Pick<DatacenterSave, 'id' | 'positions'>;
export type DatacenterSaveFindResponse = Pick<DatacenterSave, 'id' | 'positions'>;
