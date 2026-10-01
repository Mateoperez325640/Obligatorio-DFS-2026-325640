import {
  crearPartido,
  obtenerPartidosPaginados,
  obtenerPartidoPorId,
  modificarPartido,
  eliminarPartido,
  obtenerPartidoParaResumen,
} from "../services/match.service.js";
import { generarResumenPartido } from "../services/resumen-partido.service.js";

export const crear = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const partido = await crearPartido(req.body, userId);

    return res.status(201).json({
      message: "Partido creado correctamente",
      partido,
    });
  } catch (error) {
    return next(error);
  }
};

export const obtenerTodos = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { pagina, limite, localTeam, visitorTeam, category } =
      res.locals.validatedQuery;

    const resultado = await obtenerPartidosPaginados(userId, {
      pagina: pagina ?? 1,
      limite: limite ?? 20,
      localTeam,
      visitorTeam,
      category,
    });

    return res.status(200).json(resultado);
  } catch (error) {
    return next(error);
  }
};

export const obtenerPorId = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const partidoId = req.params.id;

    const partido = await obtenerPartidoPorId(partidoId, userId);

    return res.status(200).json(partido);
  } catch (error) {
    return next(error);
  }
};

export const modificar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const partidoId = req.params.id;

    const partido = await modificarPartido(partidoId, userId, req.body);

    return res.status(200).json({
      message: "Partido modificado correctamente",
      partido,
    });
  } catch (error) {
    return next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const partidoId = req.params.id;

    await eliminarPartido(partidoId, userId);

    return res.status(200).json({
      message: "Partido eliminado correctamente",
    });
  } catch (error) {
    return next(error);
  }
};

export const generarResumenPartidoController = async (req, res, next) => {
  try {
    const partidoId = req.params.id;
    const userId = req.user.id;

    const partido = await obtenerPartidoParaResumen(partidoId, userId);

    const datosPartido = {
      equipoLocal: partido.localTeam.name,
      equipoVisitante: partido.visitorTeam.name,
      puntajeLocal: partido.localScore,
      puntajeVisitante: partido.visitorScore,
      categoria: partido.category.name,
      fecha: partido.date,
    };

    const resumen = await generarResumenPartido(datosPartido);

    return res.status(200).json({
      message: "Resumen generado correctamente",
      resumen,
    });
  } catch (error) {
    return next(error);
  }
};
