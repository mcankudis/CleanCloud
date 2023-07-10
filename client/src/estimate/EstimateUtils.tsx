import { LatLng } from 'leaflet';
import { httpService } from '../HttpService';
import { BACKEND_URL } from '../config';
import { DatacenterLocation } from '../location/DatacenterLocation';
import { Timeframe, getTimeFrameModifier } from '../timeframe/Timeframe';
import { Estimate, EstimateTotal, TotalEstimate } from './Estimate';

export const fetchEstimate = async (latLng: LatLng) => {
    const url = `${BACKEND_URL}/estimate?lat=${Math.round(latLng.lat)}&lng=${Math.round(
        latLng.lng
    )}`;

    return await httpService.fetch<Estimate>(url);
};

export const getEstimate = (
    location: DatacenterLocation,
    timeframe: Timeframe
): EstimateTotal | undefined => {
    const { baseEstimate, projectedEnergyConsumptionInKWh } = location;
    if (!baseEstimate || baseEstimate.type !== 'DATA' || !projectedEnergyConsumptionInKWh)
        return undefined;

    const timeFrameModifier = getTimeFrameModifier(timeframe);

    return {
        producedCarbon: Math.round(
            baseEstimate.data.estimatedCarbonIntensity *
                projectedEnergyConsumptionInKWh *
                timeFrameModifier
        ),
        totalCost: {
            value: Math.round(
                baseEstimate.data.estimatedCostPerKWh.value *
                    projectedEnergyConsumptionInKWh *
                    timeFrameModifier
            ),
            currency: baseEstimate.data.estimatedCostPerKWh.currency,
        },
        zone: baseEstimate.data.zone,
    };
};

const formatCO2ForDisplay = (co2: number) => {
    if (co2 < 1000) return `${co2}g`;
    if (co2 < 1000000) return `${(co2 / 1000).toFixed(2)}kg`;
    return `${(co2 / 1000000).toFixed(2)}t`;
};

export const getEstimateForDisplay = (estimate: TotalEstimate) => {
    if (estimate.baseCarbonIntensity === 0) return null;
    if (estimate.computed)
        return (
            <div className="mt-2">
                <h5>Estimates</h5>

                <div>
                    C0<sub>2</sub> produced per kWh: {estimate.baseCarbonIntensity.toFixed(2)}g
                </div>

                {Object.entries(estimate.computed.totalCost).map(([currency, value]) => (
                    <div key={currency}>
                        Total energy cost: {value.toFixed(2)} {currency}
                    </div>
                ))}
                <div>
                    Total C0<sub>2</sub> produced:{' '}
                    {formatCO2ForDisplay(estimate.computed.producedCarbon)}
                </div>
            </div>
        );
};
