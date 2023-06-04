import { useContext } from 'react';
import { SelectedLocationActionsContext, SelectedLocationContext } from './SelectedLocationContext';

/** @returns Value of the SelectedLocationContext */
export const useSelectedLocation = () => {
    const ctx = useContext(SelectedLocationContext);
    if (!ctx) throw new Error('Component beyond SelectedLocationContext!');
    return ctx;
};

/** @returns Actions of the SelectedLocationContext */
export const useSelectedLocationActions = () => {
    const setSelectedLocation = useContext(SelectedLocationActionsContext);
    if (!setSelectedLocation) throw new Error('Component beyond SelectedLocationContext!');

    return {
        setSelectedLocation,
    };
};
