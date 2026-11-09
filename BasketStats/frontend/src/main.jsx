import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import Rutas from "./components/Rutas.jsx";
import "./index.css";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Rutas />
    </Provider>
  </StrictMode>,
);
