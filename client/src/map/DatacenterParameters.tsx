import { LatLng } from 'leaflet';
import { useEffect, useMemo, useState } from 'react';
import { MdBolt } from 'react-icons/md';
import { Estimate } from './Estimate';
import { useSelectedLocation } from './useSelectedLocation';

// todo move to config
const BACKEND_URL = 'http://localhost:3545';

export const DataCenterParameters = () => {
    const { latLng } = useSelectedLocation();

    const [energyConsumption, setEnergyConsumption] = useState<number | undefined>(undefined);
    const [estimateUnit, setEstimateUnit] = useState<Estimate | undefined>(undefined);

    const getEstimate = (estimateUnit?: Estimate, consumption?: number): Estimate | undefined => {
        if (!consumption || !estimateUnit) return undefined;
        return {
            estimatedCarbonIntensity: estimateUnit.estimatedCarbonIntensity * consumption,
            estimatedCostPerKWh: {
                value: estimateUnit.estimatedCostPerKWh.value * consumption,
                currency: estimateUnit.estimatedCostPerKWh.currency,
            },
            zone: estimateUnit.zone,
        };
    };

    const fetchEstimate = async (latLng?: LatLng) => {
        // todo alert/toast
        if (!latLng) return;

        // todo type this
        const url = `${BACKEND_URL}/estimate?lat=${Math.round(latLng.lat)}&lng=${Math.round(
            latLng.lng
        )}`;
        const response = await fetch(url);
        const data = await response.json();

        setEstimateUnit(data);
    };

    const estimate = useMemo(
        () => getEstimate(estimateUnit, energyConsumption),
        [estimateUnit, energyConsumption]
    );

    useEffect(() => {
        fetchEstimate(latLng);
    }, [latLng]);

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
            <div className="block text-left">
                {latLng && <div>DEBUG: {latLng.toString()}</div>}
                {estimateUnit && (
                    <div>
                        ESTIMATE UNIT: <pre>{JSON.stringify(estimateUnit, null, 2)}</pre>
                    </div>
                )}
                {estimate && (
                    <div>
                        ESTIMATE: <pre>{JSON.stringify(estimate, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};
