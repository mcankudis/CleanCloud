import { LatLng } from 'leaflet';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { EstimateState } from '../estimate/Estimate';
import { fetchEstimate } from '../estimate/EstimateUtils';
import { DatacenterLocation } from './DatacenterLocation';
import {
    OpenLocationActionsContext,
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
    const setOpenLocation = useContext(OpenLocationActionsContext);
    if (!setSelectedLocations) throw new Error('Component beyond SelectedLocationsContext!');
    if (!setOpenLocation) throw new Error('Component beyond OpenLocationContext!');

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

        toast.success('Updated projected energy consumption');
    };

    const addLocation = async (latLng: LatLng) => {
        const estimate = await fetchEstimate(latLng);

        const baseEstimate: EstimateState = estimate.success
            ? { type: 'DATA', data: estimate.data }
            : { type: 'ERROR', message: estimate.errorMessage };

        setSelectedLocations((prev) => {
            const newLocation: DatacenterLocation = {
                coordinates: latLng,
                baseEstimate,
            };
            if (!prev) return [newLocation];
            if (prev.some((location) => location.coordinates.equals(latLng))) return prev;
            return [...prev, newLocation];
        });
        toast.success("Location added, don't forget to save your changes");
        toast.info('Click on the marker or in the list to edit the projected energy consumption');
    };

    const removeLocation = (latLng: LatLng) => {
        setSelectedLocations((prev) => {
            if (!prev) return [];
            return prev.filter((location) => !location.coordinates.equals(latLng));
        });
        toast.success("Location removed, don't forget to save your changes");
    };

    const clearAllLocations = () => {
        setSelectedLocations([]);
        toast.success("All locations removed, don't forget to save your changes");
    };

    const openLocation = (location: DatacenterLocation) => {
        setOpenLocation(undefined);
        setTimeout(() => setOpenLocation(location), 0);
    };

    return {
        addLocation,
        clearAllLocations,
        removeLocation,
        openLocation,
        updateLocationConsumption,
    };
};
