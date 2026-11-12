import { configureStore } from "@reduxjs/toolkit";
import sesionReducer from "./features/sesionSlice.js";
import partidosReducer from "./features/partidosSlice.js";
import catalogosReducer from "./features/catalogosSlice.js";

export const store = configureStore({
  reducer: {
    sesion: sesionReducer,
    partidos: partidosReducer,
    catalogos: catalogosReducer,
  },
});
