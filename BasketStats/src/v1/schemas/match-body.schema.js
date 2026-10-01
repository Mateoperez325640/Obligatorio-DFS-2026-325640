import Joi from "joi";

export const partidoBodySchema = Joi.object({
  localTeam: Joi.string().hex().length(24).required(),
  visitorTeam: Joi.string().hex().length(24).required(),
  category: Joi.string().hex().length(24).required(),
  localScore: Joi.number().min(0).required(),
  visitorScore: Joi.number().min(0).required(),
  date: Joi.date().required(),
});

export const modificarPartidoBodySchema = Joi.object({
  localTeam: Joi.string().hex().length(24),
  visitorTeam: Joi.string().hex().length(24),
  category: Joi.string().hex().length(24),
  localScore: Joi.number().min(0),
  visitorScore: Joi.number().min(0),
  date: Joi.date(),
}).min(1);
