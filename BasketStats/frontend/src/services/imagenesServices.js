import api from "./authServices.js";

export const subirImagenApi = async (imagenBase64) => {
  const token = localStorage.getItem("token");

  const respuesta = await api.post(
    "/images",
    {
      image: imagenBase64,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return respuesta.data;
};
