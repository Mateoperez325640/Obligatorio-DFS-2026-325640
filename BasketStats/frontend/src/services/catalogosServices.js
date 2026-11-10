import api from "./authServices.js";

export const obtenerEquiposApi = async () => {
  const token = localStorage.getItem("token");

  const respuesta = await api.get("/teams", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return respuesta.data;
};

export const obtenerCategoriasApi = async () => {
  const token = localStorage.getItem("token");

  const respuesta = await api.get("/categories", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return respuesta.data;
};

export const crearEquipoApi = async (datosEquipo) => {
  const token = localStorage.getItem("token");

  const respuesta = await api.post("/teams", datosEquipo, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return respuesta.data;
};

export const editarEquipoApi = async (idEquipo, datosEquipo) => {
  const token = localStorage.getItem("token");

  const respuesta = await api.patch(`/teams/${idEquipo}`, datosEquipo, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return respuesta.data;
};

export const eliminarEquipoApi = async (idEquipo) => {
  const token = localStorage.getItem("token");

  const respuesta = await api.delete(`/teams/${idEquipo}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return respuesta.data;
};

export const crearCategoriaApi = async (datosCategoria) => {
  const token = localStorage.getItem("token");

  const respuesta = await api.post("/categories", datosCategoria, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return respuesta.data;
};

export const editarCategoriaApi = async (idCategoria, datosCategoria) => {
  const token = localStorage.getItem("token");

  const respuesta = await api.patch(
    `/categories/${idCategoria}`,
    datosCategoria,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return respuesta.data;
};

export const eliminarCategoriaApi = async (idCategoria) => {
  const token = localStorage.getItem("token");

  const respuesta = await api.delete(`/categories/${idCategoria}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return respuesta.data;
};
