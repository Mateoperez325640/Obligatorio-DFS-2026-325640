import api from "./authServices.js";

export const obtenerJugadoresApi = async () => {
  const token = localStorage.getItem("token");

  const respuesta = await api.get("/players", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return respuesta.data;
};

export const crearJugadorApi = async (datosJugador) => {
  const token = localStorage.getItem("token");

  const respuesta = await api.post("/players", datosJugador, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return respuesta.data;
};

export const editarJugadorApi = async (idJugador, datosJugador) => {
  const token = localStorage.getItem("token");

  const respuesta = await api.patch(`/players/${idJugador}`, datosJugador, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return respuesta.data;
};

export const eliminarJugadorApi = async (idJugador) => {
  const token = localStorage.getItem("token");

  const respuesta = await api.delete(`/players/${idJugador}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return respuesta.data;
};
