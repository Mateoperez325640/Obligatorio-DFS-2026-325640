import {
  crearJugador,
  obtenerJugadores,
  obtenerJugadorPorId,
  modificarJugador,
  eliminarJugador,
} from "../services/player.service.js";

export const crear = async (req, res, next) => {
  try {
    const jugador = await crearJugador(req.body);

    return res.status(201).json({
      message: "Jugador creado correctamente",
      jugador,
    });
  } catch (error) {
    return next(error);
  }
};

export const obtenerTodos = async (req, res, next) => {
  try {
    const jugadores = await obtenerJugadores();

    return res.status(200).json({
      jugadores,
    });
  } catch (error) {
    return next(error);
  }
};

export const obtenerPorId = async (req, res, next) => {
  try {
    const jugadorId = req.params.id;

    const jugador = await obtenerJugadorPorId(jugadorId);

    return res.status(200).json({
      jugador,
    });
  } catch (error) {
    return next(error);
  }
};

export const modificar = async (req, res, next) => {
  try {
    const jugadorId = req.params.id;

    const jugador = await modificarJugador(jugadorId, req.body);

    return res.status(200).json({
      message: "Jugador modificado correctamente",
      jugador,
    });
  } catch (error) {
    return next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    const jugadorId = req.params.id;

    await eliminarJugador(jugadorId);

    return res.status(200).json({
      message: "Jugador eliminado correctamente",
    });
  } catch (error) {
    return next(error);
  }
};
