import { useContext } from 'react';
import { Timeframe } from '../TImeframe';
import { EstimateActionsContext, EstimateContext } from './EstimateContext';

/** @returns Value of the EstimateContext */
export const useEstimate = () => {
    const ctx = useContext(EstimateContext);
    if (!ctx) throw new Error('Component beyond EstimateContext!');
    return ctx;
};

/** @returns Actions of the EstimateContext */
export const useEstimateActions = () => {
    const setEstimateInput = useContext(EstimateActionsContext);

    if (!setEstimateInput) throw new Error('Component beyond EstimateContext!');

    const setEnergyConsumption = (value: number) => {
        setEstimateInput((prev) => {
            const requestedTimeframe = prev?.requestedTimeframe || 'hour';
            return { requestedTimeframe, projectedEnergyConsumption: value };
        });
    };

    const setTimeframe = (value: Timeframe) => {
        setEstimateInput((prev) => {
            const projectedEnergyConsumption = prev?.projectedEnergyConsumption || 0;
            return { projectedEnergyConsumption, requestedTimeframe: value };
        });
    };

    return {
        setEnergyConsumption,
        setTimeframe,
    };
};
