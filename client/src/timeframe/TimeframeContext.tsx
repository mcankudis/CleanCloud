import { Dispatch, SetStateAction, createContext, useEffect, useRef, useState } from 'react';
import { Timeframe } from './Timeframe';

export interface TimeframeContext {
    timeframe?: Timeframe;
}

export const TimeframeContext = createContext<TimeframeContext | undefined>(undefined);

export const TimeframeActionsContext = createContext<
    Dispatch<SetStateAction<Timeframe | undefined>> | undefined
>(undefined);

export const TimeframeContextProvider = ({ children }: { children: React.ReactNode }) => {
    const _isMounted = useRef(false);
    const [timeframe, setTimeframe] = useState<Timeframe | undefined>(undefined);

    useEffect(() => {
        _isMounted.current = true;
        return () => {
            _isMounted.current = false;
        };
    }, []);

    return (
        <TimeframeActionsContext.Provider value={setTimeframe}>
            <TimeframeContext.Provider value={{ timeframe }}>{children}</TimeframeContext.Provider>
        </TimeframeActionsContext.Provider>
    );
};
