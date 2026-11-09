import { configureStore } from "@reduxjs/toolkit";
import sesionReducer from "./features/sesionSlice.js";

export const store = configureStore({
  reducer: {
    sesion: sesionReducer,
  },
});
