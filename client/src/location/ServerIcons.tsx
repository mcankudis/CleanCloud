import L from 'leaflet';

const iconSize = new L.Point(32, 51);
const className = 'leaflet-div-icon';

export const ServerIconGray = new L.Icon({
    iconUrl: '/gray.png',
    iconSize,
    className,
});

export const ServerIconGreen = new L.Icon({
    iconUrl: '/green.png',
    iconSize,
    className,
});

export const ServerIconYellow = new L.Icon({
    iconUrl: '/yellow.png',
    iconSize,
    className,
});

export const ServerIconRed = new L.Icon({
    iconUrl: '/red.png',
    iconSize,
    className,
});
