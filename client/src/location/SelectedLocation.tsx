import { Marker as LeafletMarker } from 'leaflet';
import { useEffect, useRef } from 'react';
import { MdBolt } from 'react-icons/md';
import { Marker, Popup } from 'react-leaflet';
import { Loader } from '../components/Loader';
import { formatCO2ForDisplay } from '../estimate/EstimateUtils';
import { useTimeframe } from '../timeframe/useTimeframe';
import { DatacenterLocation } from './DatacenterLocation';
import { getIconForCO2Level } from './LocationUtils';
import { useSelectedLocationsActions } from './useSelectedLocation';

const ennergyConsumptionPresets = [100, 250, 500, 1000];

export const SelectedLocation = (props: { location: DatacenterLocation; isOpen: boolean }) => {
    const markerRef = useRef<LeafletMarker>(null);
    const { location } = props;
    const { removeLocation, updateLocationConsumption } = useSelectedLocationsActions();
    const { timeframe } = useTimeframe();

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
                <div className="text-xl">
                    Datacenter ({location.coordinates.lat.toFixed(2)}°N,{' '}
                    {location.coordinates.lng.toFixed(2)}°E)
                </div>

                {location.baseEstimate.type === 'DATA' && (
                    <div className="text-lg">Zone: {location.baseEstimate.data.zone}</div>
                )}

                <div className="text-lg">Projected energy consumption:</div>
                <div className="flex items-center mt-2">
                    <MdBolt />
                    <input
                        className="w-full rounded p-1 mr-1 bg-slate-500"
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
                            className={`transition-all duration-200 rounded aspect-video flex items-center justify-center cursor-pointer hover:bg-slate-700 ${
                                preset === location.projectedEnergyConsumptionInKWh
                                    ? 'bg-slate-600'
                                    : 'bg-slate-500'
                            }`}
                            key={preset}
                            onClick={() => updateLocationConsumption(location, preset)}
                        >
                            {preset} kW
                        </div>
                    ))}
                </div>

                {location.baseEstimate.type === 'LOADING' && <Loader color="#fff" />}
                {location.baseEstimate.type === 'ERROR' && <div>Failed to load data</div>}
                {location.baseEstimate.type === 'DATA' && (
                    <div className="mt-2" style={{ fontSize: '14px' }}>
                        <div className="text-lg">Estimates</div>

                        <div className="flex items-center">
                            <div>Carbon intensity:</div>
                            <div className="ml-1 font-bold">
                                {location.baseEstimate.data.estimatedCarbonIntensity.toFixed(2)}{' '}
                                g/kWh
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div>Cost per kWh:</div>
                            <div className="ml-1 font-bold">
                                {location.baseEstimate.data.estimatedCostPerKWh.value.toFixed(2)}{' '}
                                {location.baseEstimate.data.estimatedCostPerKWh.currency}
                            </div>
                        </div>

                        {!!location.computedEstimate && (
                            <>
                                <div className="flex items-center">
                                    <div>
                                        Total produced CO<sub>2</sub> in a {timeframe}:
                                    </div>
                                    <div className="ml-1 font-bold">
                                        {formatCO2ForDisplay(
                                            location.computedEstimate.producedCarbon
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div>Total energy cost in a {timeframe}:</div>
                                    <div className="ml-1 font-bold">
                                        {location.computedEstimate.totalCost.value.toFixed(2)}{' '}
                                        {location.computedEstimate.totalCost.currency}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        className="bg-red-400 mt-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeLocation(location.coordinates);
                        }}
                    >
                        Delete
                    </button>
                </div>
            </Popup>
        </Marker>
    );
};
