import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { App } from './App';
import { AboutView } from './about/AboutView';
import { MapView } from './map/MapView';
import { SettingsView } from './settings/SettingsView';

import './scss/styles.scss';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <MapView />,
            },
            {
                path: '/about',
                element: <AboutView />,
            },
            {
                path: '/settings',
                element: <SettingsView />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
