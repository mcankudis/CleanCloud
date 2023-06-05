export type Timeframe = 'hour' | 'day' | 'week' | 'month' | 'year';

export const getTimeFrameModifier = (timeframe: Timeframe) => {
    switch (timeframe) {
        case 'hour':
            return 1;
        case 'day':
            return 24;
        case 'week':
            return 24 * 7;
        case 'month':
            return 24 * 30;
        case 'year':
            return 24 * 365;
    }
};
