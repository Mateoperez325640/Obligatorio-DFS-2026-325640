import {
  crearPartido,
  obtenerPartidosPaginados,
  obtenerPartidoPorId,
} from "../services/match.service.js";

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
