export interface DatacenterSave {
    id: string;
    password?: string;
    positions: { latitude: number; longitude: number }[];
    lastAccess: Date;
}

// todo validation
export type DatacenterSaveCreateRequest = Pick<DatacenterSave, 'positions' | 'password'>;
export type DatacenterSaveUpdateRequest = Pick<DatacenterSave, 'id' | 'positions' | 'password'>;
export type DatacenterSaveFindResponse = Pick<DatacenterSave, 'id' | 'positions'>;
