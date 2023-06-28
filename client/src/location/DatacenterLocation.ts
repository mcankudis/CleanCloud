import { LatLng } from 'leaflet';
import { EstimateState, EstimateTotal } from '../estimate/Estimate';

export interface DatacenterLocation {
    coordinates: LatLng;
    projectedEnergyConsumptionInKWh?: number;
    baseEstimate: EstimateState;
    computedEstimate?: EstimateTotal;
}
