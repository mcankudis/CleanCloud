import { LatLng } from 'leaflet';
import { httpService } from '../HttpService';
import { BACKEND_URL } from '../config';
import { DatacenterLocation } from '../location/DatacenterLocation';
import { Timeframe, getTimeFrameModifier } from '../timeframe/Timeframe';
import { Estimate, EstimateTotal } from './Estimate';

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
