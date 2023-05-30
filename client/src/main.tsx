import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'

import './scss/styles.scss';

import {
  createBrowserRouter,
  RouterProvider,
  LoaderFunctionArgs,
} from "react-router-dom";

import App from "./App";
import { Impressum } from "./Impressum.tsx";
import { Einstellungen } from "./Einstellungen.tsx";
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
        element: <Impressum />,
      },
      {
        path: "/Einstellungen",
        element: <Einstellungen/>,
      }
    ]
  },
  // {
  //   path: "MemoPage/:memoId",
  //   element: <MemoPage />,
  //   loader: ({ params }: LoaderFunctionArgs) => {
  //     for (let i = 0; i < memoList.length; i++) {
  //       if (memoList[i].id == Number(params.memoId)) {
  //         return memoList[i];
  //       }
  //     }
  //   }
  // }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
