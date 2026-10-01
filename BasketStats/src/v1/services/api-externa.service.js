import axios from "axios";

const urlExternaBase = "https://nagerholidays.com/api/v4";

const apiExterna = axios.create({
  baseURL: urlExternaBase,
  headers: {
    "Content-Type": "application/json",
  },
});

export const obtenerFeriadosUruguayService = async (anio) => {
  const response = await apiExterna.get(`/Holidays/UY/${anio}`);

  return response.data;
};
