import { useSelectedLocations } from '../location/useSelectedLocation';

interface TotalEstimate {
    baseCarbonIntensity: number;
    computed: {
        totalCost: { [key in string]: number };
        producedCarbon: number;
    };
}

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

    if (estimate.baseCarbonIntensity === 0) return null;

    return (
        <>
            {!!estimate?.computed && (
                <div
                    className="absolute top-4 left-20 rounded bg-zinc-700 p-5 opacity-90"
                    style={{ zIndex: 999 }}
                >
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
                        Total C0<sub>2</sub> produced: {estimate.computed.producedCarbon.toFixed(2)}
                        g
                    </div>
                </div>
            )}
        </>
    );
};
