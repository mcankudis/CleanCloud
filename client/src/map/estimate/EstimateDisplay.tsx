import { Loader } from '../../components/Loader';
import { useEstimate } from './useEstimate';

export const EstimateDisplay = () => {
    const { estimate } = useEstimate();

    if (estimate.base.type === 'INITIAL') return null;

    if (estimate.base.type === 'LOADING') return <Loader color="#fff" />;

    if (estimate.base.type === 'ERROR')
        return (
            <div className="rounded bg-zinc-700 p-2">
                Error loading estimate: {estimate.base.message}
            </div>
        );

    const baseData = estimate.base.data;

    return (
        <>
            {!!estimate?.computed && (
                <div className="rounded bg-zinc-700 p-2">
                    <h5>Estimates</h5>
                    {baseData.estimatedCostPerKWh.value === 0 ? (
                        'No electricity price found'
                    ) : (
                        <div>
                            Energy const per kWh: {baseData.estimatedCostPerKWh.value.toFixed(2)}{' '}
                            {baseData.estimatedCostPerKWh.currency}
                        </div>
                    )}

                    <div>
                        C0<sub>2</sub> produced per kWh:{' '}
                        {baseData.estimatedCarbonIntensity?.toFixed(2)}g
                    </div>
                    {estimate.computed.totalCost.value > 0 && (
                        <div>
                            Total energy cost: {estimate.computed.totalCost.value.toFixed(2)}{' '}
                            {estimate.computed.totalCost.currency}
                        </div>
                    )}
                    <div>
                        Total C0<sub>2</sub> produced: {estimate.computed.producedCarbon.toFixed(2)}
                        g
                    </div>
                </div>
            )}
        </>
    );
};
