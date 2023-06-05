import { Estimate, EstimateTotal } from '../Estimate';
import { Timeframe, getTimeFrameModifier } from '../TImeframe';

export const getEstimate = (
    estimateUnit?: Estimate,
    consumption?: number,
    timeframe?: Timeframe
): EstimateTotal | undefined => {
    if (!consumption || !estimateUnit || !timeframe) return undefined;
    const timeFrameModifier = getTimeFrameModifier(timeframe);

    return {
        producedCarbon: Math.round(
            estimateUnit.estimatedCarbonIntensity * consumption * timeFrameModifier
        ),
        totalCost: {
            value: Math.round(
                estimateUnit.estimatedCostPerKWh.value * consumption * timeFrameModifier
            ),
            currency: estimateUnit.estimatedCostPerKWh.currency,
        },
        zone: estimateUnit.zone,
    };
};
