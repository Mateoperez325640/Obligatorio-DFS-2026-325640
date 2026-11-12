import { configureStore } from "@reduxjs/toolkit";
import sesionReducer from "./features/sesionSlice.js";
import partidosReducer from "./features/partidosSlice.js";
import catalogosReducer from "./features/catalogosSlice.js";
import jugadoresReducer from "./features/jugadoresSlice.js";

export const store = configureStore({
  reducer: {
    sesion: sesionReducer,
    partidos: partidosReducer,
    catalogos: catalogosReducer,
    jugadores: jugadoresReducer,
  },
});
