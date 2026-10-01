import Joi from "joi";

export const listarPartidosQuerySchema = Joi.object({
  pagina: Joi.number().integer().min(1),
  limite: Joi.number().integer().min(1).max(100),
  localTeam: Joi.string().hex().length(24),
  visitorTeam: Joi.string().hex().length(24),
  category: Joi.string().hex().length(24),
});
