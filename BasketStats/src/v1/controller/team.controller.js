import { crearEquipo } from "../services/team.service.js";

export const crear = async (req, res) => {
  try {
    const equipo = await crearEquipo(req.body);

    return res.status(201).json({
      message: "Equipo creado correctamente",
      equipo,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Error interno del servidor",
    });
  }
};
