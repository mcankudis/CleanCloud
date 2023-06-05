export interface Estimate {
    zone: string;
    estimatedCarbonIntensity: number;
    estimatedCostPerKWh: {
        currency: string;
        value: number;
    };
}

export interface EstimateTotal {
    zone: string;
    producedCarbon: number;
    totalCost: {
        currency: string;
        value: number;
    };
}
