import api from "./authServices.js";

export const generarResumenPartidoApi = async (idPartido) => {
  const token = localStorage.getItem("token");

  const respuesta = await api.post(
    `/matches/${idPartido}/resumen`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return respuesta.data;
};
