import api from "./authServices.js";

export const obtenerPartidosApi = async () => {
  const token = localStorage.getItem("token");

  const respuesta = await api.get("/matches", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return respuesta.data;
};

export const crearPartidoApi = async (datosPartido) => {
  const token = localStorage.getItem("token");

  const respuesta = await api.post("/matches", datosPartido, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return respuesta.data;
};

export const eliminarPartidoApi = async (idPartido) => {
  const token = localStorage.getItem("token");

  const respuesta = await api.delete(`/matches/${idPartido}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return respuesta.data;
};

export const editarPartidoApi = async (idPartido, datosPartido) => {
  const token = localStorage.getItem("token");

  const respuesta = await api.patch(`/matches/${idPartido}`, datosPartido, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return respuesta.data;
};
