import api from "./authServices.js";

export const obtenerPartidosApi = async ({
  pagina = 1,
  limite = 20,
  category = "",
} = {}) => {
  const token = localStorage.getItem("token");

  const params = { pagina, limite };

  if (category) {
    params.category = category;
  }

  const respuesta = await api.get("/matches", {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return respuesta.data;
};

export const obtenerPartidoPorIdApi = async (idPartido) => {
  const token = localStorage.getItem("token");

  const respuesta = await api.get(`/matches/${idPartido}`, {
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
