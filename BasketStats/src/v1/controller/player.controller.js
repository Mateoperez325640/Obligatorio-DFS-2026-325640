import { crearJugador } from "../services/player.service.js";

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
