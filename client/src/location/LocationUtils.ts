import { ServerIconGray, ServerIconGreen, ServerIconRed, ServerIconYellow } from './ServerIcons';

export const getIconForCO2Level = (co2gramsPerKWh?: number) => {
    if (co2gramsPerKWh === undefined) return ServerIconGray;
    if (co2gramsPerKWh < 50) return ServerIconGreen;
    if (co2gramsPerKWh < 200) return ServerIconYellow;
    return ServerIconRed;
};
