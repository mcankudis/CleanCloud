import { MdBolt } from 'react-icons/md';
import { Loader } from '../components/Loader';
import { Timeframe } from './TImeframe';
import { useEstimate, useEstimateActions } from './estimate/useEstimate';
import { useSelectedLocation } from './location/useSelectedLocation';

export const DataCenterParameters = () => {
    const { latLng } = useSelectedLocation();
    const { estimate, input } = useEstimate();
    const { setEnergyConsumption, setTimeframe } = useEstimateActions();

    const ennergyConsumptionPresets = [100, 250, 500, 1000];
    const timeframePresets: Timeframe[] = ['hour', 'day', 'week', 'month', 'year'];

    // todo proper states
    const isInputSet = input?.projectedEnergyConsumption && input?.requestedTimeframe;
    const isLoading = latLng && isInputSet && !estimate?.computed;

    return (
        <div className="p-2 text-left">
            <div>Projected energy consumption:</div>
            <div className="flex items-center mt-2">
                <MdBolt />
                <input
                    className="w-full rounded p-1 mr-1"
                    min={0}
                    onChange={(e) => setEnergyConsumption(+e.target.value)}
                    placeholder="Expected avg. energy usage"
                    type="number"
                    value={input?.projectedEnergyConsumption || ''}
                />
                <div>kW</div>
            </div>

            <div className="grid grid-cols-4 mt-2 gap-1">
                {ennergyConsumptionPresets.map((preset) => (
                    <div
                        className={`transition-all duration-200 rounded aspect-video flex items-center justify-center cursor-pointer ${
                            preset === input?.projectedEnergyConsumption
                                ? 'bg-zinc-500'
                                : 'bg-zinc-700'
                        }`}
                        key={preset}
                        onClick={() => setEnergyConsumption(preset)}
                    >
                        {preset} kW
                    </div>
                ))}
            </div>

            <div className="flex flex-col mt-2 gap-1 mb-2">
                <div>Show estimates per:</div>
                {timeframePresets.map((preset) => (
                    <div
                        className={`transition-all duration-200 rounded p-2 flex items-center justify-center cursor-pointer ${
                            preset === input?.requestedTimeframe ? 'bg-zinc-500' : 'bg-zinc-700'
                        }`}
                        key={preset}
                        onClick={() => setTimeframe(preset)}
                    >
                        {preset}
                    </div>
                ))}
            </div>

            {!isInputSet && latLng && (
                <div>Set energy consumption and timeframe to see estimates</div>
            )}
            {isLoading && <Loader color="#fff" />}

            {!!estimate?.computed && (
                <div className="rounded bg-zinc-700 p-2">
                    <h5>Estimates</h5>
                    <div>
                        Energy const per kWh: {estimate.base?.estimatedCostPerKWh.value}{' '}
                        {estimate.base?.estimatedCostPerKWh.currency}
                    </div>
                    <div>
                        C0<sub>2</sub> produced per kWh:{' '}
                        {estimate.base?.estimatedCarbonIntensity?.toFixed(2)}g
                    </div>
                    <div>
                        Total energy cost: {estimate.computed.totalCost.value}{' '}
                        {estimate.computed.totalCost.currency}
                    </div>
                    <div>
                        Total C0<sub>2</sub> produced: {estimate.computed.producedCarbon}g
                    </div>
                </div>
            )}

            {/* <div className="block text-left">
                {latLng && <div>DEBUG: {latLng.toString()}</div>}
                {estimate?.base && (
                    <div>
                        ESTIMATE BASE: <pre>{JSON.stringify(estimate.base, null, 2)}</pre>
                    </div>
                )}
                {estimate?.computed && (
                    <div>
                        ESTIMATE: <pre>{JSON.stringify(estimate.computed, null, 2)}</pre>
                    </div>
                )}
            </div> */}
        </div>
    );
};
