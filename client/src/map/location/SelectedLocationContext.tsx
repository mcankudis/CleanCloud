import { LatLng } from 'leaflet';
import { createContext, useState } from 'react';

interface SelectedLocationContext {
    latLng: LatLng | undefined;
}

export const SelectedLocationContext = createContext<SelectedLocationContext | undefined>(
    undefined
);

export const SelectedLocationActionsContext = createContext<((latLng: LatLng) => void) | undefined>(
    undefined
);

export const SelectedLocationContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedLocationState, setSelectedLocationState] = useState<LatLng | undefined>(
        undefined
    );

    return (
        <SelectedLocationActionsContext.Provider value={setSelectedLocationState}>
            <SelectedLocationContext.Provider value={{ latLng: selectedLocationState }}>
                {children}
            </SelectedLocationContext.Provider>
        </SelectedLocationActionsContext.Provider>
    );
};
