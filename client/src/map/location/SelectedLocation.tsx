import { LatLng } from 'leaflet';
import { useState } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { useEstimate } from '../estimate/useEstimate';
import { useSelectedLocationActions } from './useSelectedLocation';

export const SelectedLocation = () => {
    const [selectedLatLng, setSelectedLatLng] = useState<LatLng | undefined>(undefined);

    const { input, estimate } = useEstimate();
    const { setSelectedLocation } = useSelectedLocationActions();

    useMapEvents({
        click: (e) => {
            setSelectedLatLng(e.latlng);
            setSelectedLocation(e.latlng);
        },
    });

    const isInputSet = input?.projectedEnergyConsumption && input?.requestedTimeframe;

    if (!selectedLatLng) return null;

    return (
        <Marker position={selectedLatLng}>
            {!isInputSet && (
                <Popup>
                    <div>
                        <div>
                            Enter projected energy consumption and select a time frame to see
                            estimations
                        </div>
                    </div>
                </Popup>
            )}

            {isInputSet && !estimate?.computed && <Popup>Loading...</Popup>}

            {isInputSet && estimate?.computed && (
                <Popup>
                    <div>
                        <div>Estimated for timeframe: 1 {input?.requestedTimeframe}</div>
                        <div>
                            Estimated total energy cost: {estimate.computed.totalCost.value}{' '}
                            {estimate.computed.totalCost.currency}
                        </div>
                        <div>
                            Estimated total C0<sub>2</sub> produced:{' '}
                            {estimate.computed.producedCarbon}g
                        </div>
                    </div>
                </Popup>
            )}
        </Marker>
    );
};
