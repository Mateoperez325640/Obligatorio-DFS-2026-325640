import api from "./authServices.js";

const feriadosPorAnio = {};

export const obtenerFeriadosUruguayApi = async (anio) => {
  if (feriadosPorAnio[anio]) {
    return feriadosPorAnio[anio];
  }

  const token = localStorage.getItem("token");

  const respuesta = await api.get(`/externa/feriados/${anio}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!Array.isArray(respuesta.data)) {
    throw new Error("La API devolvió feriados inválidos.");
  }

  feriadosPorAnio[anio] = respuesta.data;

  return respuesta.data;
};

export const buscarFeriadoPorFecha = async (fecha) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    throw new Error("La fecha no es válida.");
  }

  const anio = fecha.substring(0, 4);
  const feriados = await obtenerFeriadosUruguayApi(anio);

  return feriados.find((feriado) => feriado?.date === fecha) || null;
};
