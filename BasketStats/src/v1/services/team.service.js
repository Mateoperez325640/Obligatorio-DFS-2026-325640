import Equipo from "../models/team.model.js";

export const crearEquipo = async (equipoData) => {
  const { name } = equipoData;

  const existeEquipo = await Equipo.findOne({ name });

  if (existeEquipo) {
    const error = new Error("El equipo ya existe");
    error.statusCode = 409;
    throw error;
  }

  const equipo = await Equipo.create({
    name,
  });

  return equipo;
};
