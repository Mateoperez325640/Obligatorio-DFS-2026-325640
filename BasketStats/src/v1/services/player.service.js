import Jugador from "../models/player.model.js";
import Equipo from "../models/team.model.js";

export const crearJugador = async (jugadorData) => {
  const { name, team } = jugadorData;

  const equipo = await Equipo.findById(team);

  if (!equipo) {
    const error = new Error("Equipo no encontrado");
    error.statusCode = 404;
    throw error;
  }

  const jugador = await Jugador.create({
    name,
    team,
  });

  return jugador;
};

export const obtenerJugadores = async () => {
  const jugadores = await Jugador.find();

  return jugadores;
};

export const obtenerJugadorPorId = async (jugadorId) => {
  const jugador = await Jugador.findById(jugadorId);

  if (!jugador) {
    const error = new Error("Jugador no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return jugador;
};
