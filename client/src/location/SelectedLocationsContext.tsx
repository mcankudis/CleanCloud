import { LatLng } from 'leaflet';
import { Dispatch, SetStateAction, createContext, useEffect, useState } from 'react';
import { EstimateState } from '../estimate/Estimate';
import { fetchEstimate, getEstimate } from '../estimate/EstimateUtils';
import { Save, SavePosition } from '../save/Save';
import { useSave } from '../save/useSave';
import { useTimeframe } from '../timeframe/useTimeframe';
import { DatacenterLocation } from './DatacenterLocation';

export interface SelectedLocationsContext {
    locations: DatacenterLocation[];
}

export const SelectedLocationsContext = createContext<SelectedLocationsContext | undefined>(
    undefined
);

const fetchEstimateWrapper = async (coordinates: LatLng): Promise<EstimateState> => {
    const estimate = await fetchEstimate(coordinates);

    if (estimate.success) return { type: 'DATA', data: estimate.data };
    return { type: 'ERROR', message: estimate.errorMessage };
};

export const SelectedLocationActionsContext = createContext<
    Dispatch<SetStateAction<DatacenterLocation[]>> | undefined
>(undefined);

const mapLocationsFromSaveToDatacenterLocations = async (
    positions: SavePosition[]
): Promise<DatacenterLocation[]> => {
    const promises = positions.map(async (position) => {
        const latLng = new LatLng(position.latitude, position.longitude);
        return {
            baseEstimate: await fetchEstimateWrapper(latLng),
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

    const updateSelectedLocations = async (newSave: Save) => {
        try {
            const mappedLocations = await mapLocationsFromSaveToDatacenterLocations(
                newSave.positions
            );
            setSelectedLocations(mappedLocations);
        } catch (error) {
            // todo error toast + logging
            console.error(error);
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
        <SelectedLocationActionsContext.Provider value={setSelectedLocations}>
            <SelectedLocationsContext.Provider value={{ locations: selectedLocations }}>
                {children}
            </SelectedLocationsContext.Provider>
        </SelectedLocationActionsContext.Provider>
    );
};
