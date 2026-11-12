import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  equipos: [],
  categorias: [],
};

const catalogosSlice = createSlice({
  name: "catalogos",
  initialState,
  reducers: {
    cargarCatalogosSlice: (state, action) => {
      state.equipos = action.payload.equipos;
      state.categorias = action.payload.categorias;
    },

    limpiarCatalogosSlice: (state) => {
      state.equipos = [];
      state.categorias = [];
    },
  },
});

export const { cargarCatalogosSlice, limpiarCatalogosSlice } =
  catalogosSlice.actions;

export default catalogosSlice.reducer;
