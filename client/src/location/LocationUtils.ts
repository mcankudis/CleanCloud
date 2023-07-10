import { ServerIconGray, ServerIconGreen, ServerIconRed, ServerIconYellow } from './ServerIcons';

export const getIconForCO2Level = (co2gramsPerKWh?: number) => {
    if (co2gramsPerKWh === undefined) return ServerIconGray;
    if (co2gramsPerKWh < 50) return ServerIconGreen;
    if (co2gramsPerKWh < 200) return ServerIconYellow;
    return ServerIconRed;
};

export const getColorClassForCO2Level = (co2gramsPerKWh?: number) => {
    if (co2gramsPerKWh === undefined) return 'text-gray-200';
    if (co2gramsPerKWh < 50) return 'text-green-500';
    if (co2gramsPerKWh < 200) return 'text-yellow-500';
    return 'text-red-500';
};
