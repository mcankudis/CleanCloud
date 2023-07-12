import { useContext } from 'react';
import { toast } from 'react-toastify';
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
            toast.success('Save created');
            setSave(res.data);
            linkHook(res.data.id);
            return;
        }

        // todo log errors to backend
        toast.error('Error creating save');
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

        if (res.success) {
            toast.success('Save updated');
            setSave(res.data);
            linkHook(res.data.id);
            return;
        }

        // todo log errors to backend
        toast.error('Error updating save');
    };

    const linkHook = (id: string) => {
        const link = `${window.location.origin}/${id}`;
        window.history.replaceState(null, 'Clean Cloud', `/${id}`);
        window.navigator.clipboard.writeText(link);
        toast.info(`Link copied to clipboard`);
    };

    return {
        setSave,
        createNewSave,
        updateSave,
    };
};
