import React from "react";
import ReactDOM from "react-dom/client";

import "./scss/styles.scss";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import { Contacts } from "./Contacts.tsx";
import { Settings } from "./Settings.tsx";
import HomePage from "./HomePage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/Impressum",
        element: <Contacts />,
      },
      {
        path: "/Settings",
        element: <Settings />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
