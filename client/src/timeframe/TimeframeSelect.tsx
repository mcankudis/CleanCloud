import { Timeframe } from './Timeframe';
import { useTimeframe, useTimeframeActions } from './useTimeframe';

export const TimeframeSelect = () => {
    const { timeframe } = useTimeframe();
    const { setTimeframe } = useTimeframeActions();

    const timeframePresets: Timeframe[] = ['hour', 'day', 'week', 'month', 'year'];

    return (
        <div className="flex gap-1 items-center justify-center">
            <div className="mr-4">Show estimates for:</div>

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
    );
};
