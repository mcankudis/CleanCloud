import { useSelectedLocations } from '../location/useSelectedLocation';
import { TimeframeSelect } from '../timeframe/TimeframeSelect';
import { TotalEstimate } from './Estimate';
import { getEstimateForDisplay } from './EstimateUtils';

export const EstimateDisplay = () => {
    const { locations } = useSelectedLocations();

    const estimate = locations.reduce<TotalEstimate>(
        (acc, location) => {
            if (location.baseEstimate.type === 'INITIAL') return acc;
            if (location.baseEstimate.type === 'LOADING') return acc;
            if (location.baseEstimate.type === 'ERROR') return acc;
            if (!location.computedEstimate) return acc;

            const acc2 = { ...acc };

            acc2.baseCarbonIntensity += location.baseEstimate.data.estimatedCarbonIntensity;
            acc2.computed.producedCarbon += location.computedEstimate.producedCarbon;

            if (!acc2.computed.totalCost[location.computedEstimate.totalCost.currency])
                acc2.computed.totalCost[location.computedEstimate.totalCost.currency] = 0;

            acc2.computed.totalCost[location.computedEstimate.totalCost.currency] +=
                location.computedEstimate.totalCost.value;

            return acc2;
        },
        {
            baseCarbonIntensity: 0,
            computed: {
                totalCost: {},
                producedCarbon: 0,
            },
        }
    );

    return (
        <div
            className="absolute top-4 right-4 rounded bg-zinc-700 p-5 opacity-90 text-white"
            style={{ zIndex: 999 }}
        >
            <TimeframeSelect />
            {getEstimateForDisplay(estimate)}
        </div>
    );
};
