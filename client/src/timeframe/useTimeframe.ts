import { useContext } from 'react';
import { TimeframeActionsContext, TimeframeContext } from './TimeframeContext';

/** @returns Value of the TimeframeContext */
export const useTimeframe = () => {
    const ctx = useContext(TimeframeContext);
    if (!ctx) throw new Error('Component beyond TimeframeContext!');
    return ctx;
};

/** @returns Actions of the TimeframeContext */
export const useTimeframeActions = () => {
    const setTimeframe = useContext(TimeframeActionsContext);
    if (!setTimeframe) throw new Error('Component beyond TimeframeContext!');

    return {
        setTimeframe,
    };
};
