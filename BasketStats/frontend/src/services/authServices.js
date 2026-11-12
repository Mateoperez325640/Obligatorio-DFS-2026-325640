import axios from "axios";

const api = axios.create({
  baseURL: "https://basket-stats-iota.vercel.app/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const registrarApi = async (datosRegistro) => {
  const respuesta = await api.post("/auth/registrar", datosRegistro);
  return respuesta.data;
};

export const loginApi = async (datosLogin) => {
  const respuesta = await api.post("/auth/login", datosLogin);
  return respuesta.data;
};

export default api;

