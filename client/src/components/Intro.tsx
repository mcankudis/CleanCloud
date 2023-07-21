import { useEffect, useState } from 'react';
import { useSave } from '../save/useSave';

export const Intro = () => {
    const [hasSeenIntro, setHasSeenIntro] = useState(true);
    const { save } = useSave();

    useEffect(() => {
        const hasSeenIntro = localStorage.getItem('hasSeenIntro');
        if (!hasSeenIntro) setHasSeenIntro(false);
    }, []);

    const completeIntro = () => {
        localStorage.setItem('hasSeenIntro', 'true');
        setHasSeenIntro(true);
    };

    if (hasSeenIntro) return null;

    return (
        <div
            className="w-full h-full absolute top-0 left-0 flex justify-center items-center bg-black bg-opacity-40"
            style={{ zIndex: 9999 }}
            onClick={completeIntro}
        >
            <div
                className="rounded bg-slate-700 p-10 text-white bg-opacity-90 drop-shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>Oh, hi there!</h2>

                <p className="mt-2 text-2xl">
                    Looks like you're new here. Welcome to the CleanCloud!
                </p>

                <p className="mt-6 text-lg">
                    Click on the map to add a location for a datacenter. Then specify its expected
                    energy consumption.
                </p>

                <p className="mt-6 text-lg">
                    You will see your locations in a list to the left, you can edit and delete them.
                </p>

                <p className="mt-6 text-lg">
                    Select a timeframe in the upper right corner to see the total estimates for that
                    period.
                </p>

                {!save && (
                    <p className="mt-6 text-lg">
                        If you want to save your locations, click on the save button in the upper
                        right corner. Your configuration will be saved under a permalink, so you can
                        share it with others.
                    </p>
                )}

                {save && (
                    <p className="mt-6 text-lg">
                        It seems that you came here via a save permalink. Locations saved under this
                        link will be loaded automatically.
                        <br />
                        Click <i>save</i> again to update the permalink.
                    </p>
                )}

                <button
                    className="mt-6 bg-slate-500 hover:bg-slate-600 rounded px-10 py-4"
                    onClick={completeIntro}
                >
                    Got it!
                </button>
            </div>
        </div>
    );
};
