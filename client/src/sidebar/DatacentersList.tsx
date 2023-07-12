import { useSelectedLocations } from '../location/useSelectedLocation';
import { DatacenterRow } from './DatacenterRow';
export const DatacentersList = () => {
    const { locations, openLocation } = useSelectedLocations();
    return (
        <div className="overflow-auto">
            <div className="font-bold">Datacenters</div>
            <table className="w-full border-collapse text-center text-sm text-gray-200">
                <thead>
                    <tr>
                        <th scope="col" className="px-2 py-4 font-medium">
                            Location
                        </th>
                        <th scope="col" className="px-2 py-4 font-medium">
                            CO<sub>2</sub>/kWh
                        </th>
                        <th scope="col" className="px-2 py-4 font-medium"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-400 border-t border-gray-400">
                    {locations.map((location) => (
                        <DatacenterRow
                            location={location}
                            key={location.coordinates.toString()}
                            isOpen={openLocation?.coordinates.equals(location.coordinates) ?? false}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
