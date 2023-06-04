export interface Estimate {
    zone: string;
    estimatedCarbonIntensity: number;
    estimatedCostPerKWh: {
        currency: string;
        value: number;
    };
}
