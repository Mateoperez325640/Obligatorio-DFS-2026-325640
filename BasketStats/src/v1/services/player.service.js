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
