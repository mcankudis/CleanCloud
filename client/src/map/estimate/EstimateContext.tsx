import { LatLng } from 'leaflet';
import { Dispatch, createContext, useEffect, useMemo, useRef, useState } from 'react';
import { AsyncDataState } from '../../AsyncDataState';
import { httpService } from '../../HttpService';
import { Estimate, EstimateTotal } from '../Estimate';
import { Timeframe } from '../TImeframe';
import { useSelectedLocation } from '../location/useSelectedLocation';
import { getEstimate } from './EstimateUtils';

interface EstimateInputData {
    projectedEnergyConsumption: number;
    requestedTimeframe: Timeframe;
}

type EstimateState = AsyncDataState<Estimate>;

interface EstimateContext {
    input?: EstimateInputData;
    estimate: {
        /** Base estimate per kW returned from the API */
        base: EstimateState;
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

    const _isMounted = useRef(false);
    const [input, setInput] = useState<EstimateInputData | undefined>(undefined);
    const [estimateBase, setEstimateBase] = useState<EstimateState>({ type: 'INITIAL' });

    const fetchEstimate = async (latLng?: LatLng) => {
        // todo alert/toast
        if (!latLng) return setEstimateBase({ type: 'ERROR', message: 'No location selected' });

        setEstimateBase({ type: 'LOADING' });

        const url = `${BACKEND_URL}/estimate?lat=${Math.round(latLng.lat)}&lng=${Math.round(
            latLng.lng
        )}`;

        const response = await httpService.fetch<Estimate>(url);
        if (!_isMounted.current) return;

        if (!response.success) {
            return setEstimateBase({ type: 'ERROR', message: response.errorMessage });
        }

        setEstimateBase({ type: 'DATA', data: response.data });
    };

    const computedEstimate: EstimateTotal | undefined = useMemo(
        () =>
            estimateBase.type === 'DATA'
                ? getEstimate(
                      estimateBase.data,
                      input?.projectedEnergyConsumption,
                      input?.requestedTimeframe
                  )
                : undefined,
        [estimateBase, input]
    );

    useEffect(() => {
        fetchEstimate(latLng);
    }, [latLng]);

    useEffect(() => {
        _isMounted.current = true;
        return () => {
            _isMounted.current = false;
        };
    }, []);

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
