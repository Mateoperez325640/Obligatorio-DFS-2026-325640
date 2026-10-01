import { crearPartido } from "../services/match.service.js";

export const crear = async (req, res) => {
  try {
    const userId = req.user.id;

    const partido = await crearPartido(req.body, userId);

    return res.status(201).json({
      message: "Partido creado correctamente",
      partido,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Error interno del servidor",
    });
  }
};
