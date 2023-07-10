import { useContext } from 'react';
import { HttpMethods, httpService } from '../HttpService';
import { BACKEND_URL } from '../config';
import { DatacenterLocation } from '../location/DatacenterLocation';
import { CreateSaveRequest, Save, UpdateSaveRequest } from './Save';
import { SaveActionsContext, SaveContext } from './SaveContext';

/** @returns Value of the SaveContext */
export const useSave = () => {
    const ctx = useContext(SaveContext);
    if (!ctx) throw new Error('Component beyond SaveContext!');
    return ctx;
};

/** @returns Actions of the SaveContext */
export const useSaveActions = () => {
    const setSave = useContext(SaveActionsContext);
    if (!setSave) throw new Error('Component beyond SaveContext!');

    const createNewSave = async (locations: DatacenterLocation[]) => {
        const save: CreateSaveRequest = {
            positions: locations.map((location) => ({
                latitude: location.coordinates.lat,
                longitude: location.coordinates.lng,
                projectedEnergyConsumptionInKWh: location.projectedEnergyConsumptionInKWh,
            })),
        };

        const res = await httpService.fetch<Save>(`${BACKEND_URL}/save`, {
            method: HttpMethods.POST,
            body: save,
        });

        if (res.success) {
            // todo toast
            setSave(res.data);
            const link = `${window.location.origin}/${res.data.id}`;
            window.history.replaceState(null, 'Clean Cloud', `/${res.data.id}`);
            window.navigator.clipboard.writeText(link);
        }

        // todo error handling
        console.error(res);
    };

    const updateSave = async (saveId: string, locations: DatacenterLocation[]) => {
        const save: UpdateSaveRequest = {
            id: saveId,
            positions: locations.map((location) => ({
                latitude: location.coordinates.lat,
                longitude: location.coordinates.lng,
                projectedEnergyConsumptionInKWh: location.projectedEnergyConsumptionInKWh,
            })),
        };

        const res = await httpService.fetch<Save>(`${BACKEND_URL}/save`, {
            method: HttpMethods.PATCH,
            body: save,
        });

        // todo extract to avoid code duplication
        if (res.success) {
            // todo toast
            setSave(res.data);
            const link = `${window.location.origin}/${res.data.id}`;
            window.history.replaceState(null, 'Clean Cloud', `/${res.data.id}`);
            window.navigator.clipboard.writeText(link);
        }

        // todo error handling
        console.error(res);
    };

    return {
        setSave,
        createNewSave,
        updateSave,
    };
};
