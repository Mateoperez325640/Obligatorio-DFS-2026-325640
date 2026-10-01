import {
  crearEquipo,
  obtenerEquipos,
  obtenerEquipoPorId,
  modificarEquipo,
  eliminarEquipo,
} from "../services/team.service.js";

export const crear = async (req, res, next) => {
  try {
    const equipo = await crearEquipo(req.body);

    return res.status(201).json({
      message: "Equipo creado correctamente",
      equipo,
    });
  } catch (error) {
    return next(error);
  }
};

export const obtenerTodos = async (req, res, next) => {
  try {
    const equipos = await obtenerEquipos();

    return res.status(200).json({
      equipos,
    });
  } catch (error) {
    return next(error);
  }
};

export const obtenerPorId = async (req, res, next) => {
  try {
    const equipoId = req.params.id;

    const equipo = await obtenerEquipoPorId(equipoId);

    return res.status(200).json({
      equipo,
    });
  } catch (error) {
    return next(error);
  }
};

export const modificar = async (req, res, next) => {
  try {
    const equipoId = req.params.id;

    const equipo = await modificarEquipo(equipoId, req.body);

    return res.status(200).json({
      message: "Equipo modificado correctamente",
      equipo,
    });
  } catch (error) {
    return next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    const equipoId = req.params.id;

    await eliminarEquipo(equipoId);

    return res.status(200).json({
      message: "Equipo eliminado correctamente",
    });
  } catch (error) {
    return next(error);
  }
};
