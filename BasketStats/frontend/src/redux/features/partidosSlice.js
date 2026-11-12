import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lista: [],
  total: 0,
  pagina: 1,
  limite: 20,
};

const partidosSlice = createSlice({
  name: "partidosSlice",
  initialState,
  reducers: {
    cargarPartidosSlice: (state, action) => {
      state.lista = action.payload.partidos;
      state.total = action.payload.total;
      state.pagina = action.payload.pagina;
      state.limite = action.payload.limite;
    },

    agregarPartidoSlice: (state, action) => {
      state.lista.unshift(action.payload);
      state.total += 1;
    },

    actualizarPartidoSlice: (state, action) => {
      const indice = state.lista.findIndex(
        (partido) => partido.id === action.payload.id,
      );

      if (indice !== -1) {
        state.lista[indice] = action.payload;
      }
    },

    eliminarPartidoSlice: (state, action) => {
      state.lista = state.lista.filter(
        (partido) => partido.id !== action.payload,
      );

      state.total = Math.max(0, state.total - 1);
    },

    limpiarPartidosSlice: (state) => {
      state.lista = [];
      state.total = 0;
      state.pagina = 1;
    },
  },
});

export const {
  cargarPartidosSlice,
  agregarPartidoSlice,
  actualizarPartidoSlice,
  eliminarPartidoSlice,
  limpiarPartidosSlice,
} = partidosSlice.actions;

export default partidosSlice.reducer;
