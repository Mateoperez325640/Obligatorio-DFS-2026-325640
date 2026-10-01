import Equipo from "../models/team.model.js";
import Jugador from "../models/player.model.js";
import Partido from "../models/match.model.js";

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

export const obtenerEquipos = async () => {
  const equipos = await Equipo.find();

  return equipos;
};

export const obtenerEquipoPorId = async (equipoId) => {
  const equipo = await Equipo.findById(equipoId);

  if (!equipo) {
    const error = new Error("Equipo no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return equipo;
};

export const modificarEquipo = async (equipoId, equipoData) => {
  const { name } = equipoData;

  const equipo = await Equipo.findById(equipoId);

  if (!equipo) {
    const error = new Error("Equipo no encontrado");
    error.statusCode = 404;
    throw error;
  }

  const existeEquipo = await Equipo.findOne({ name });

  if (existeEquipo && existeEquipo.id !== equipo.id) {
    const error = new Error("El equipo ya existe");
    error.statusCode = 409;
    throw error;
  }

  equipo.name = name;

  await equipo.save();

  return equipo;
};

export const eliminarEquipo = async (equipoId) => {
  const equipo = await Equipo.findById(equipoId);

  if (!equipo) {
    const error = new Error("Equipo no encontrado");
    error.statusCode = 404;
    throw error;
  }

  const jugadorConEquipo = await Jugador.findOne({
    team: equipoId,
  });

  if (jugadorConEquipo) {
    const error = new Error(
      "No se puede eliminar el equipo porque tiene jugadores asociados",
    );
    error.statusCode = 409;
    throw error;
  }

  const partidoComoLocal = await Partido.findOne({
    localTeam: equipoId,
  });

  if (partidoComoLocal) {
    const error = new Error(
      "No se puede eliminar el equipo porque está siendo utilizado en un partido",
    );
    error.statusCode = 409;
    throw error;
  }

  const partidoComoVisitante = await Partido.findOne({
    visitorTeam: equipoId,
  });

  if (partidoComoVisitante) {
    const error = new Error(
      "No se puede eliminar el equipo porque está siendo utilizado en un partido",
    );
    error.statusCode = 409;
    throw error;
  }

  const equipoEliminado = await Equipo.findByIdAndDelete(equipoId);

  return equipoEliminado;
};
