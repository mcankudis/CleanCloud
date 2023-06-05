import { DataCenterParameters } from './DatacenterParameters';
import { Map } from './Map';
import { EstimateContextProvider } from './estimate/EstimateContext';
import { SelectedLocationContextProvider } from './location/SelectedLocationContext';

export const MapView = () => {
    return (
        <div className="grid grid-cols-5">
            <SelectedLocationContextProvider>
                <EstimateContextProvider>
                    <div className="col-1">
                        <DataCenterParameters />
                    </div>
                    <div className="col-2 col-span-4">
                        <Map />
                    </div>
                </EstimateContextProvider>
            </SelectedLocationContextProvider>
        </div>
    );
};
