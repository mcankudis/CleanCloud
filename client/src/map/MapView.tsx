import { DataCenterParameters } from './DatacenterParameters';
import { Map } from './Map';
import { SelectedLocationContextProvider } from './SelectedLocationContext';

export const MapView = () => {
    return (
        <div className="grid grid-cols-5">
            <SelectedLocationContextProvider>
                <div className="col-1">
                    <DataCenterParameters />
                </div>
                <div className="col-2 col-span-4">
                    <Map />
                </div>
            </SelectedLocationContextProvider>
        </div>
    );
};
