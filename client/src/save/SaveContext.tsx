import { Dispatch, SetStateAction, createContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { httpService } from '../HttpService';
import { BACKEND_URL } from '../config';
import { Save } from './Save';

export interface SaveContext {
    save?: Save;
}

export const SaveContext = createContext<SaveContext | undefined>(undefined);

export const SaveActionsContext = createContext<
    Dispatch<SetStateAction<Save | undefined>> | undefined
>(undefined);

export const SaveContextProvider = ({ children }: { children: React.ReactNode }) => {
    const _isMounted = useRef(false);
    const { id } = useParams();
    const [save, setSave] = useState<Save | undefined>(undefined);

    const fetchSave = async (saveId: string) => {
        const res = await httpService.fetch<Save>(`${BACKEND_URL}/save/${saveId}`);

        if (!res.success) {
            // todo error handling
            return;
        }

        if (_isMounted.current) {
            setSave(res.data);
        }
    };

    useEffect(() => {
        _isMounted.current = true;
        if (id) fetchSave(id);

        return () => {
            _isMounted.current = false;
        };
    }, []);

    return (
        <SaveActionsContext.Provider value={setSave}>
            <SaveContext.Provider value={{ save }}>{children}</SaveContext.Provider>
        </SaveActionsContext.Provider>
    );
};
