import { LatLng } from 'leaflet';
import { Dispatch, SetStateAction, createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { EstimateState } from '../estimate/Estimate';
import { getEstimate } from '../estimate/EstimateUtils';
import { Save, SavePosition } from '../save/Save';
import { useSave } from '../save/useSave';
import { useTimeframe } from '../timeframe/useTimeframe';
import { DatacenterLocation } from './DatacenterLocation';

export interface SelectedLocationsContext {
    locations: DatacenterLocation[];
    openLocation?: DatacenterLocation;
}

export const SelectedLocationsContext = createContext<SelectedLocationsContext | undefined>(
    undefined
);

export const SelectedLocationActionsContext = createContext<
    Dispatch<SetStateAction<DatacenterLocation[]>> | undefined
>(undefined);

export const OpenLocationActionsContext = createContext<
    Dispatch<SetStateAction<DatacenterLocation | undefined>> | undefined
>(undefined);

const mapLocationsFromSaveToDatacenterLocations = async (
    positions: SavePosition[]
): Promise<DatacenterLocation[]> => {
    const promises = positions.map(async (position) => {
        const latLng = new LatLng(position.latitude, position.longitude);
        const estimateState: EstimateState = position.baseEstimate
            ? { type: 'DATA', data: position.baseEstimate }
            : { type: 'ERROR', message: 'Failed to fetch data' };

        return {
            baseEstimate: estimateState,
            coordinates: latLng,
            projectedEnergyConsumptionInKWh: position.projectedEnergyConsumptionInKWh,
        };
    });

    return await Promise.all(promises);
};

export const SelectedLocationContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { timeframe } = useTimeframe();

    const { save } = useSave();

    const [selectedLocations, setSelectedLocations] = useState<DatacenterLocation[]>([]);
    const [openLocation, setOpenLocation] = useState<DatacenterLocation | undefined>(undefined);

    const updateSelectedLocations = async (newSave: Save) => {
        try {
            const mappedLocations = await mapLocationsFromSaveToDatacenterLocations(
                newSave.positions
            );
            setSelectedLocations(mappedLocations);
        } catch (error) {
            // todo log errors to backend or use sentry
            toast.error('Failed to process locations');
        }
    };

    useEffect(() => {
        if (save) updateSelectedLocations(save);
    }, [save]);

    useEffect(() => {
        if (!timeframe) return;

        const updatedLocations = selectedLocations.map((location) => ({
            ...location,
            computedEstimate: getEstimate(location, timeframe),
        }));

        setSelectedLocations(updatedLocations);

        // todo - react to location changes, but do not cause infinite loop
    }, [timeframe, selectedLocations.length]);

    return (
        <OpenLocationActionsContext.Provider value={setOpenLocation}>
            <SelectedLocationActionsContext.Provider value={setSelectedLocations}>
                <SelectedLocationsContext.Provider
                    value={{ locations: selectedLocations, openLocation }}
                >
                    {children}
                </SelectedLocationsContext.Provider>
            </SelectedLocationActionsContext.Provider>
        </OpenLocationActionsContext.Provider>
    );
};
