import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import CalculoPage from "./pages/CalculoPage";
import PDFPage from "./pages/PDFPage";
import { CalculoProvider } from "./context/CalculoProvider";

const router = createHashRouter([
  {
    path: "/",
    element: <CalculoPage />
  },
  { 
    path: "/pdf",
    element: <PDFPage />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <CalculoProvider>
      <RouterProvider router={router} />
    </CalculoProvider>
);
