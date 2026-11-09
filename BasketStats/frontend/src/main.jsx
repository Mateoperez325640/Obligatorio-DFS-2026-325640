import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Rutas from "./components/Rutas.jsx";
import "./index.css";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Rutas />
  </StrictMode>
);
