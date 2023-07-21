import { useSelectedLocations, useSelectedLocationsActions } from '../location/useSelectedLocation';
import { useSave, useSaveActions } from '../save/useSave';
import { DatacentersList } from './DatacentersList';

export const Sidebar = () => {
    const { locations } = useSelectedLocations();
    const { clearAllLocations } = useSelectedLocationsActions();
    const { save } = useSave();
    const { createNewSave, updateSave } = useSaveActions();

    const onSave = () => (save ? updateSave(save.id, locations) : createNewSave(locations));

    return (
        <div className="main-layout bg-neutral-800 text-white">
            <div className="flex items-center gap-2 p-2">
                <button className="bg-green-800" onClick={onSave}>
                    Save
                </button>
                <button className="bg-red-800" onClick={clearAllLocations}>
                    Clear all
                </button>
            </div>

            <div className="justify-center overflow-auto">
                <div className="row justify-center overflow-auto">
                    <DatacentersList />
                </div>
            </div>
        </div>
    );
};
