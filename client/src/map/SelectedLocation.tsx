import { LatLng } from 'leaflet';
import { useState } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { useSelectedLocationActions } from './useSelectedLocation';

export const SelectedLocation = () => {
    const [selectedLatLng, setSelectedLatLng] = useState<LatLng | undefined>(undefined);

    const { setSelectedLocation } = useSelectedLocationActions();

    useMapEvents({
        click: (e) => {
            setSelectedLatLng(e.latlng);
            setSelectedLocation(e.latlng);
        },
    });

    if (!selectedLatLng) return null;
    return (
        <Marker position={selectedLatLng}>
            <Popup>Selected Location</Popup>
        </Marker>
    );
};
