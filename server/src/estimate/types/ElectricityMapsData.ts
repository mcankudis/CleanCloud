export interface RegionData {
    zone: string;
    carbonIntensity: number;
    /** ISO Datestring */
    datetime: string;
    /** ISO Datestring */
    updatedAt: string;
    /** ISO Datestring */
    createdAt: string;
    emissionFactorType: string;
    isEstimated: boolean;
    estimationMethod: string | null;
}

export interface ElectricityMapsHistoryData {
    zone: string;
    history: RegionData[];
}
