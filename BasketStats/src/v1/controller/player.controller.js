import {
  crearJugador,
  obtenerJugadores,
  obtenerJugadorPorId,
} from "../services/player.service.js";

export const crear = async (req, res) => {
  try {
    const jugador = await crearJugador(req.body);

    return res.status(201).json({
      message: "Jugador creado correctamente",
      jugador,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Error interno del servidor",
    });
  }
};

export const obtenerTodos = async (req, res) => {
  try {
    const jugadores = await obtenerJugadores();

    return res.status(200).json({
      jugadores,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Error interno del servidor",
    });
  }
};

export const obtenerPorId = async (req, res) => {
  try {
    const jugadorId = req.params.id;

    const jugador = await obtenerJugadorPorId(jugadorId);

    return res.status(200).json({
      jugador,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Error interno del servidor",
    });
  }
};
