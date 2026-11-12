import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lista: [],
  total: 0,
  totalFiltrado: 0,
  pagina: 1,
  limite: 5,
  filtroCategoria: "",
};

const partidosSlice = createSlice({
  name: "partidosSlice",
  initialState,
  reducers: {
    cargarPartidosSlice: (state, action) => {
      const {
        partidos,
        total,
        pagina,
        limite,
        filtroCategoria = "",
      } = action.payload;

      state.lista = partidos;
      state.totalFiltrado = total;
      state.pagina = pagina;
      state.limite = limite;
      state.filtroCategoria = filtroCategoria;

      // El total general se actualiza únicamente
      // cuando la consulta no tiene filtro.
      if (!filtroCategoria) {
        state.total = total;
      }
    },

    agregarPartidoSlice: (state, action) => {
      const partido = action.payload;

      state.total += 1;

      const coincideConFiltro =
        !state.filtroCategoria || partido.category === state.filtroCategoria;

      if (!coincideConFiltro) {
        return;
      }

      state.totalFiltrado += 1;

      // El backend ordena los partidos del más nuevo al más viejo.
      // Un partido nuevo corresponde a la primera página.
      if (state.pagina === 1) {
        state.lista.unshift(partido);

        // Mantenemos el tamaño máximo de la página
        // sin consultar nuevamente todos los partidos.
        state.lista = state.lista.slice(0, state.limite);
      }
    },

    actualizarPartidoSlice: (state, action) => {
      const partidoActualizado = action.payload;

      const indice = state.lista.findIndex(
        (partido) => partido.id === partidoActualizado.id,
      );

      if (indice === -1) {
        return;
      }

      const coincideConFiltro =
        !state.filtroCategoria ||
        partidoActualizado.category === state.filtroCategoria;

      if (coincideConFiltro) {
        state.lista[indice] = partidoActualizado;
      } else {
        // Si cambió la categoría, ya no debe aparecer
        // en el listado filtrado.
        state.lista.splice(indice, 1);
        state.totalFiltrado = Math.max(0, state.totalFiltrado - 1);
      }
    },

    eliminarPartidoSlice: (state, action) => {
      const idPartido = action.payload;

      const indice = state.lista.findIndex(
        (partido) => partido.id === idPartido,
      );

      if (indice !== -1) {
        state.lista.splice(indice, 1);
        state.totalFiltrado = Math.max(0, state.totalFiltrado - 1);
      }

      state.total = Math.max(0, state.total - 1);
    },

    limpiarPartidosSlice: (state) => {
      state.lista = [];
      state.total = 0;
      state.totalFiltrado = 0;
      state.pagina = 1;
      state.limite = 5;
      state.filtroCategoria = "";
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
