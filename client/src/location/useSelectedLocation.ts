import { LatLng } from 'leaflet';
import { useContext } from 'react';
import { fetchEstimate } from '../estimate/EstimateUtils';
import { DatacenterLocation } from './DatacenterLocation';
import {
    SelectedLocationActionsContext,
    SelectedLocationsContext,
} from './SelectedLocationsContext';

/** @returns Value of the SelectedLocationsContext */
export const useSelectedLocations = () => {
    const ctx = useContext(SelectedLocationsContext);
    if (!ctx) throw new Error('Component beyond SelectedLocationsContext!');
    return ctx;
};

/** @returns Actions of the SelectedLocationsContext */
export const useSelectedLocationsActions = () => {
    const setSelectedLocations = useContext(SelectedLocationActionsContext);
    if (!setSelectedLocations) throw new Error('Component beyond SelectedLocationsContext!');

    const updateLocationConsumption = async (
        location: DatacenterLocation,
        newConsumptionInKW: number
    ) => {
        const updatedLocation: DatacenterLocation = {
            ...location,
            projectedEnergyConsumptionInKWh: newConsumptionInKW,
        };

        const newEstimate = await fetchEstimate(updatedLocation.coordinates);

        if (newEstimate.success)
            updatedLocation.baseEstimate = { type: 'DATA', data: newEstimate.data };
        else updatedLocation.baseEstimate = { type: 'ERROR', message: newEstimate.errorMessage };

        setSelectedLocations((locations) =>
            locations?.map((loc) =>
                loc.coordinates.equals(updatedLocation.coordinates) ? updatedLocation : loc
            )
        );
    };

    const addLocation = (latLng: LatLng) => {
        setSelectedLocations((prev) => {
            const newLocation: DatacenterLocation = {
                coordinates: latLng,
                baseEstimate: { type: 'INITIAL' },
            };
            if (!prev) return [newLocation];
            if (prev.some((location) => location.coordinates.equals(latLng))) return prev;
            return [...prev, newLocation];
        });
    };

    const removeLocation = (latLng: LatLng) => {
        setSelectedLocations((prev) => {
            if (!prev) return [];
            return prev.filter((location) => !location.coordinates.equals(latLng));
        });
    };

    const clearAllLocations = () => {
        setSelectedLocations([]);
    };

    return {
        addLocation,
        clearAllLocations,
        removeLocation,
        updateLocationConsumption,
    };
};
