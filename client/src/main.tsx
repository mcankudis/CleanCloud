import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { App } from './App';
import { AboutView } from './about/AboutView';
import { MapView } from './map/MapView';

import 'react-toastify/dist/ReactToastify.css';
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
                path: '/:id',
                element: <MapView />,
            },
            {
                path: '/about',
                element: <AboutView />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
        <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        />
    </React.StrictMode>
);
