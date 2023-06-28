import { Loader } from './components/Loader';
import { DatacenterLocation } from './location/DatacenterLocation';
import { useSelectedLocations } from './location/useSelectedLocation';
import { useSave, useSaveActions } from './save/useSave';
import { Timeframe } from './timeframe/Timeframe';
import { useTimeframe, useTimeframeActions } from './timeframe/useTimeframe';

const getBaseEstimateDisplay = (location: DatacenterLocation) => {
    if (!location.baseEstimate) return 'TODO: no base estimate';

    // todo do this properly in datacenter list component
    switch (location.baseEstimate.type) {
        case 'INITIAL':
            return '';
        case 'LOADING':
            return <Loader color="#fff" />;
        case 'ERROR':
            return 'ERROR';
        case 'DATA':
            return `${
                location.baseEstimate.data.zone
            } ${location.baseEstimate.data.estimatedCarbonIntensity.toFixed(2)} kW`;
    }
};

const copySaveLinkToClipboard = (saveId: string) => {
    const link = `${window.location.origin}/${saveId}`;
    window.navigator.clipboard.writeText(link);
    // todo toast
};

export const DataCenterParameters = () => {
    const { locations } = useSelectedLocations();
    const { timeframe } = useTimeframe();
    const { setTimeframe } = useTimeframeActions();
    const { save } = useSave();
    const { createNewSave, updateSave } = useSaveActions();

    const timeframePresets: Timeframe[] = ['hour', 'day', 'week', 'month', 'year'];

    const onSave = () => (save ? updateSave(save.id, locations) : createNewSave(locations));

    return (
        <div className="p-2 text-left">
            <div className="flex flex-col mt-2 gap-1 mb-2">
                <div>Show estimates for:</div>

                {timeframePresets.map((preset) => (
                    <div
                        className={`transition-all duration-200 rounded p-2 flex items-center justify-center cursor-pointer hover:bg-zinc-600 ${
                            preset === timeframe ? 'bg-zinc-500' : 'bg-zinc-700'
                        }`}
                        key={preset}
                        onClick={() => setTimeframe(preset)}
                    >
                        {preset}
                    </div>
                ))}
            </div>

            <div>TODO proper datacenters list here</div>

            <div>
                {locations.map((location) => (
                    <div className="p-1" key={location.coordinates.toString()}>
                        {location.coordinates.lat.toFixed(2)}, {location.coordinates.lng.toFixed(2)}{' '}
                        | {getBaseEstimateDisplay(location)}
                    </div>
                ))}
            </div>

            {save && (
                <button
                    className="bg-green-700 mb-2"
                    title="Copy link to saved datacenters to clipboard"
                    onClick={() => copySaveLinkToClipboard(save.id)}
                >
                    Copy link to saved datacenters to clipboard
                </button>
            )}

            <button className="bg-green-700" onClick={onSave}>
                Save datacenters
            </button>
        </div>
    );
};
