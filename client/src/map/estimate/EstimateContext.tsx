import { LatLng } from 'leaflet';
import { Dispatch, createContext, useEffect, useMemo, useState } from 'react';
import { Estimate, EstimateTotal } from '../Estimate';
import { Timeframe } from '../TImeframe';
import { useSelectedLocation } from '../location/useSelectedLocation';
import { getEstimate } from './EstimateUtils';

interface EstimateInputData {
    projectedEnergyConsumption: number;
    requestedTimeframe: Timeframe;
}

interface EstimateContext {
    input?: EstimateInputData;
    estimate?: {
        /** Base estimate per kW returned from the API */
        base?: Estimate;
        /** Computed estimate after factoring in user input */
        computed?: EstimateTotal;
    };
}

export const EstimateContext = createContext<EstimateContext | undefined>(undefined);

export const EstimateActionsContext = createContext<
    Dispatch<React.SetStateAction<EstimateInputData | undefined>> | undefined
>(undefined);

// todo move to config
const BACKEND_URL = 'http://localhost:3545';

export const EstimateContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { latLng } = useSelectedLocation();

    const [input, setInput] = useState<EstimateInputData | undefined>(undefined);
    const [estimateBase, setEstimateBase] = useState<Estimate | undefined>(undefined);

    const fetchEstimate = async (latLng?: LatLng) => {
        // todo alert/toast
        if (!latLng) return;

        // todo type this
        const url = `${BACKEND_URL}/estimate?lat=${Math.round(latLng.lat)}&lng=${Math.round(
            latLng.lng
        )}`;
        const response = await fetch(url);
        const data = await response.json();

        setEstimateBase(data);
    };

    const computedEstimate = useMemo(
        () =>
            getEstimate(estimateBase, input?.projectedEnergyConsumption, input?.requestedTimeframe),
        [estimateBase, input]
    );

    useEffect(() => {
        fetchEstimate(latLng);
    }, [latLng]);

    return (
        <EstimateActionsContext.Provider value={setInput}>
            <EstimateContext.Provider
                value={{ input, estimate: { base: estimateBase, computed: computedEstimate } }}
            >
                {children}
            </EstimateContext.Provider>
        </EstimateActionsContext.Provider>
    );
};
