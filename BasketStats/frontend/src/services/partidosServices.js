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
