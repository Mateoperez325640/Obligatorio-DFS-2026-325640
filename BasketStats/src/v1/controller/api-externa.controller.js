import { obtenerFeriadosUruguayService } from "../services/api-externa.service.js";

export const obtenerFeriadosUruguayController = async (req, res, next) => {
  try {
    const anio = req.params.anio;

    const feriados = await obtenerFeriadosUruguayService(anio);

    return res.status(200).json(feriados);
  } catch (error) {
    return next(error);
  }
};
