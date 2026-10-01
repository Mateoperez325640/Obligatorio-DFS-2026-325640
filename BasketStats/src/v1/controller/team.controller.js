import {
  crearEquipo,
  obtenerEquipos,
  obtenerEquipoPorId,
} from "../services/team.service.js";

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

export const obtenerTodos = async (req, res) => {
  try {
    const equipos = await obtenerEquipos();

    return res.status(200).json({
      equipos,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Error interno del servidor",
    });
  }
};

export const obtenerPorId = async (req, res) => {
  try {
    const equipoId = req.params.id;

    const equipo = await obtenerEquipoPorId(equipoId);

    return res.status(200).json({
      equipo,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Error interno del servidor",
    });
  }
};
