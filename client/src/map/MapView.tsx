import { DataCenterParameters } from '../Sidebar';
import { SelectedLocationContextProvider } from '../location/SelectedLocationsContext';
import { SaveContextProvider } from '../save/SaveContext';
import { TimeframeContextProvider } from '../timeframe/TimeframeContext';
import { MapWrapper } from './Map';

export const MapView = () => {
    return (
        <div className="grid grid-cols-5">
            <SaveContextProvider>
                <TimeframeContextProvider>
                    <SelectedLocationContextProvider>
                        <div className="col-1">
                            <DataCenterParameters />
                        </div>
                        <div className="col-2 col-span-4 relative">
                            <MapWrapper />
                        </div>
                    </SelectedLocationContextProvider>
                </TimeframeContextProvider>
            </SaveContextProvider>
        </div>
    );
};
