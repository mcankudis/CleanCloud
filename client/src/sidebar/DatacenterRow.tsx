import { MdOutlineDeleteOutline as MdDeleteOutline } from 'react-icons/md';

import { Loader } from '../components/Loader';
import { DatacenterLocation } from '../location/DatacenterLocation';
import { getColorClassForCO2Level } from '../location/LocationUtils';
import { useSelectedLocationsActions } from '../location/useSelectedLocation';

const getBaseEstimateDisplay = (location: DatacenterLocation) => {
    switch (location.baseEstimate.type) {
        case 'INITIAL':
            return '';
        case 'LOADING':
            return <Loader color="#fff" />;
        case 'ERROR':
            return 'ERROR';
        case 'DATA':
            return `${location.baseEstimate.data.estimatedCarbonIntensity.toFixed(2)}g`;
    }
};

const getZoneDisplay = (location: DatacenterLocation) => {
    switch (location.baseEstimate.type) {
        case 'INITIAL':
            return '';
        case 'LOADING':
            return <Loader color="#fff" />;
        case 'ERROR':
            return 'ERROR';
        case 'DATA':
            return location.baseEstimate.data.zone;
    }
};

export const DatacenterRow = ({ location }: { location: DatacenterLocation }) => {
    // todo onclick - center map on location
    const { removeLocation, openLocation } = useSelectedLocationsActions();

    const color =
        location.baseEstimate.type === 'DATA'
            ? getColorClassForCO2Level(location.baseEstimate.data.estimatedCarbonIntensity)
            : getColorClassForCO2Level();

    return (
        <tr
            className="hover:bg-gray-600 transition-colors duration-300 cursor-pointer"
            onClick={() => openLocation(location)}
        >
            <td className="text-center text-sm">
                {getZoneDisplay(location)} ({location.coordinates.lat.toFixed(2)},{' '}
                {location.coordinates.lng.toFixed(2)})
            </td>
            <td className={`px-2 py-4 ${color}`}>{getBaseEstimateDisplay(location)}</td>
            <td
                className="px-2 py-4"
                style={{ fontSize: '1.35rem' }}
                onClick={() => removeLocation(location.coordinates)}
            >
                <MdDeleteOutline />
            </td>
        </tr>
    );
};
