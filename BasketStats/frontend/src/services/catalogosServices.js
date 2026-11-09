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
