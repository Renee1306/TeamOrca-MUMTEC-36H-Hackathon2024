import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import CodeOptimize from "./CodeOptimize";
import PredMain from "./PredMain";
import PerfBench from "./PerfBench";
import "./App.css";
import "./styles/tailwind.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/code-optimize",
    element: <CodeOptimize />,
  },
  {
    path: "/predictive-maintenance",
    element: <PredMain />,
  },
  {
    path: "/performance-benchmark",
    element: <PerfBench />,
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
