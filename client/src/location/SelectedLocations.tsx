import { useMapEvents } from 'react-leaflet';
import { SelectedLocation } from './SelectedLocation';
import { useSelectedLocations, useSelectedLocationsActions } from './useSelectedLocation';

export const SelectedLocations = () => {
    const { locations } = useSelectedLocations();
    const { addLocation } = useSelectedLocationsActions();

    useMapEvents({
        click: (e) => {
            addLocation(e.latlng);
        },
    });

    return (
        <>
            {locations?.map((location) => (
                <SelectedLocation location={location} key={location.coordinates.toString()} />
            ))}
        </>
    );
};
