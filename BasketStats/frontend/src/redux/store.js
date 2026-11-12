import { configureStore } from "@reduxjs/toolkit";
import sesionReducer from "./features/sesionSlice.js";
import partidosReducer from "./features/partidosSlice.js";

export const store = configureStore({
  reducer: {
    sesion: sesionReducer,
    partidos: partidosReducer,
  },
});
