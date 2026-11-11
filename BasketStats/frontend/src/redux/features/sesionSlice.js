import { createSlice } from "@reduxjs/toolkit";

const recuperarUsuario = () => {
  const token = localStorage.getItem("token");
  const usuario = localStorage.getItem("usuario");

  if (!token || !usuario) {
    return null;
  }

  try {
    const datosToken = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );

    if (!datosToken.exp || datosToken.exp * 1000 <= Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      return null;
    }

    return JSON.parse(usuario);
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    return null;
  }
};

const initialState = {
  usuario: recuperarUsuario(),
};

const sesionSlice = createSlice({
  name: "sesionSlice",
  initialState,
  reducers: {
    iniciarSesionSlice: (state, action) => {
      state.usuario = action.payload;
    },
    cerrarSesionSlice: (state) => {
      state.usuario = null;
    },
    actualizarUsuarioSlice: (state, action) => {
      state.usuario = {
        ...state.usuario,
        ...action.payload,
      };
    },
  },
});

export const { iniciarSesionSlice, cerrarSesionSlice, actualizarUsuarioSlice } =
  sesionSlice.actions;

export default sesionSlice.reducer;
