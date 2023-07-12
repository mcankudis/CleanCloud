import { Marker as LeafletMarker } from 'leaflet';
import { useEffect, useRef } from 'react';
import { MdBolt } from 'react-icons/md';
import { Marker, Popup } from 'react-leaflet';
import { DatacenterLocation } from './DatacenterLocation';
import { getIconForCO2Level } from './LocationUtils';
import { useSelectedLocationsActions } from './useSelectedLocation';

const ennergyConsumptionPresets = [100, 250, 500, 1000];

export const SelectedLocation = (props: { location: DatacenterLocation; isOpen: boolean }) => {
    const markerRef = useRef<LeafletMarker>(null);
    const { location } = props;
    const { removeLocation, updateLocationConsumption } = useSelectedLocationsActions();

    const icon =
        location.baseEstimate.type === 'DATA'
            ? getIconForCO2Level(location.baseEstimate.data.estimatedCarbonIntensity)
            : getIconForCO2Level();

    useEffect(() => {
        if (props.isOpen && markerRef.current) markerRef.current.openPopup();
    }, [props.isOpen]);

    return (
        <Marker
            ref={markerRef}
            position={location.coordinates}
            icon={icon}
            key={location.coordinates.toString()}
            eventHandlers={{ contextmenu: () => removeLocation(location.coordinates) }}
        >
            <Popup>
                <div>Projected energy consumption:</div>
                <div className="flex items-center mt-2">
                    <MdBolt />
                    <input
                        className="w-full rounded p-1 mr-1 bg-slate-200"
                        min={0}
                        onChange={(e) => updateLocationConsumption(location, +e.target.value)}
                        placeholder="Expected avg. energy usage"
                        type="number"
                        value={location.projectedEnergyConsumptionInKWh || ''}
                    />
                    <div>kW</div>
                </div>

                <div className="grid grid-cols-4 mt-2 gap-1">
                    {ennergyConsumptionPresets.map((preset) => (
                        <div
                            className={`transition-all duration-200 rounded aspect-video flex items-center justify-center cursor-pointer hover:bg-slate-300 ${
                                preset === location.projectedEnergyConsumptionInKWh
                                    ? 'bg-slate-300'
                                    : 'bg-slate-200'
                            }`}
                            key={preset}
                            onClick={() => updateLocationConsumption(location, preset)}
                        >
                            {preset} kW
                        </div>
                    ))}
                </div>

                <pre>{JSON.stringify(location, null, 4)}</pre>

                <div>
                    <button
                        className="bg-slate-200"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeLocation(location.coordinates);
                        }}
                    >
                        Delete
                    </button>
                </div>
            </Popup>

            {/* {!isInputSet && (
                <Popup>
                    <div>
                        <div>
                            Enter projected energy consumption and select a time frame to see
                            estimations
                            <button
                                className="bg-slate-200"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeLocation(location);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </Popup>
            )} */}

            {/* {isInputSet && !estimate?.computed && <Popup>Loading...</Popup>}

            {isInputSet && estimate?.computed && (
                <Popup>
                    <div>
                        <div>Estimated for timeframe: 1 {input?.requestedTimeframe}</div>
                        <div>
                            Estimated total energy cost: {estimate.computed.totalCost.value}{' '}
                            {estimate.computed.totalCost.currency}
                        </div>
                        <div>
                            Estimated total C0<sub>2</sub> produced:{' '}
                            {estimate.computed.producedCarbon}g
                        </div>
                    </div>
                </Popup>
            )} */}
        </Marker>
    );
};
