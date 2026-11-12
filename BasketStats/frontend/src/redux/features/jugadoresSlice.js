import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lista: [],
  cargados: false,
};

const jugadoresSlice = createSlice({
  name: "jugadores",
  initialState,
  reducers: {
    cargarJugadoresSlice: (state, action) => {
      state.lista = action.payload;
      state.cargados = true;
    },

    agregarJugadorSlice: (state, action) => {
      state.lista.push(action.payload);
    },

    actualizarJugadorSlice: (state, action) => {
      const indice = state.lista.findIndex(
        (jugador) => jugador.id === action.payload.id,
      );

      if (indice !== -1) {
        state.lista[indice] = action.payload;
      }
    },

    eliminarJugadorSlice: (state, action) => {
      state.lista = state.lista.filter(
        (jugador) => jugador.id !== action.payload,
      );
    },

    limpiarJugadoresSlice: (state) => {
      state.lista = [];
      state.cargados = false;
    },
  },
});

export const {
  cargarJugadoresSlice,
  agregarJugadorSlice,
  actualizarJugadorSlice,
  eliminarJugadorSlice,
  limpiarJugadoresSlice,
} = jugadoresSlice.actions;

export default jugadoresSlice.reducer;
