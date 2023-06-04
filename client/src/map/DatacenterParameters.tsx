import { useState } from 'react';
import { MdBolt } from 'react-icons/md';
import { useSelectedLocation } from './useSelectedLocation';

export const DataCenterParameters = () => {
    const [energyConsumption, setEnergyConsumption] = useState<number | undefined>(undefined);

    const { latLng } = useSelectedLocation();

    return (
        <div className="p-2">
            <div className="flex items-center mt-2">
                <MdBolt />
                <input
                    className="w-full rounded p-1 mr-1"
                    min={0}
                    onChange={(e) => setEnergyConsumption(+e.target.value)}
                    placeholder="Expected avg. energy usage"
                    type="number"
                    value={energyConsumption || ''}
                />
                <div>kW</div>
            </div>
            <div className="grid grid-cols-4 mt-2 gap-1">
                <div
                    className="rounded bg-zinc-700 aspect-video flex items-center justify-center cursor-pointer"
                    onClick={() => setEnergyConsumption(100)}
                >
                    100 kW
                </div>
                <div
                    className="rounded bg-zinc-700 aspect-video flex items-center justify-center cursor-pointer"
                    onClick={() => setEnergyConsumption(250)}
                >
                    250 kW
                </div>
                <div
                    className="rounded bg-zinc-700 aspect-video flex items-center justify-center cursor-pointer"
                    onClick={() => setEnergyConsumption(500)}
                >
                    500 kW
                </div>
                <div
                    className="rounded bg-zinc-700 aspect-video flex items-center justify-center cursor-pointer"
                    onClick={() => setEnergyConsumption(1000)}
                >
                    1000 kW
                </div>
            </div>
            {latLng && <div>DEBUG: {latLng.toString()}</div>}
        </div>
    );
};
