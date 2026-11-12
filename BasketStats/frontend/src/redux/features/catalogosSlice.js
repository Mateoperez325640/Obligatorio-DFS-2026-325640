import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  equipos: [],
  categorias: [],
  equiposCargados: false,
  categoriasCargadas: false,
};

const catalogosSlice = createSlice({
  name: "catalogos",
  initialState,
  reducers: {
    cargarCatalogosSlice: (state, action) => {
      state.equipos = action.payload.equipos;
      state.categorias = action.payload.categorias;
      state.equiposCargados = true;
      state.categoriasCargadas = true;
    },

    cargarEquiposSlice: (state, action) => {
      state.equipos = action.payload;
      state.equiposCargados = true;
    },

    agregarEquipoSlice: (state, action) => {
      state.equipos.push(action.payload);
    },

    actualizarEquipoSlice: (state, action) => {
      const indice = state.equipos.findIndex(
        (equipo) => equipo.id === action.payload.id,
      );

      if (indice !== -1) {
        state.equipos[indice] = action.payload;
      }
    },

    eliminarEquipoSlice: (state, action) => {
      state.equipos = state.equipos.filter(
        (equipo) => equipo.id !== action.payload,
      );
    },

    cargarCategoriasSlice: (state, action) => {
      state.categorias = action.payload;
      state.categoriasCargadas = true;
    },

    agregarCategoriaSlice: (state, action) => {
      state.categorias.push(action.payload);
    },

    actualizarCategoriaSlice: (state, action) => {
      const indice = state.categorias.findIndex(
        (categoria) => categoria.id === action.payload.id,
      );

      if (indice !== -1) {
        state.categorias[indice] = action.payload;
      }
    },

    eliminarCategoriaSlice: (state, action) => {
      state.categorias = state.categorias.filter(
        (categoria) => categoria.id !== action.payload,
      );
    },

    limpiarCatalogosSlice: (state) => {
      state.equipos = [];
      state.categorias = [];
      state.equiposCargados = false;
      state.categoriasCargadas = false;
    },
  },
});

export const {
  cargarCatalogosSlice,
  cargarEquiposSlice,
  agregarEquipoSlice,
  actualizarEquipoSlice,
  eliminarEquipoSlice,
  cargarCategoriasSlice,
  agregarCategoriaSlice,
  actualizarCategoriaSlice,
  eliminarCategoriaSlice,
  limpiarCatalogosSlice,
} = catalogosSlice.actions;

export default catalogosSlice.reducer;
