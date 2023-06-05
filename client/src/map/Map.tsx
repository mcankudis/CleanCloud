import { LatLng } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import { SelectedLocation } from './location/SelectedLocation';

export const Map = () => {
    const startLatLang = new LatLng(52.5, 13.4);

    return (
        <MapContainer center={startLatLang} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <SelectedLocation />
        </MapContainer>
    );
};
