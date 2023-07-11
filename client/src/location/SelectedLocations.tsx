import { useMapEvents } from 'react-leaflet';
import { SelectedLocation } from './SelectedLocation';
import { useSelectedLocations, useSelectedLocationsActions } from './useSelectedLocation';

export const SelectedLocations = () => {
    const { locations, openLocation } = useSelectedLocations();
    const { addLocation } = useSelectedLocationsActions();

    useMapEvents({
        click: (e) => {
            addLocation(e.latlng);
        },
    });

    return (
        <>
            {locations.map((location) => (
                <SelectedLocation
                    location={location}
                    key={location.coordinates.toString()}
                    isOpen={openLocation?.coordinates.equals(location.coordinates) ?? false}
                />
            ))}
        </>
    );
};
