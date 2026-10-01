import Joi from "joi";

export const partidoBodySchema = Joi.object({
  localTeam: Joi.string().hex().length(24).required(),
  visitorTeam: Joi.string().hex().length(24).required(),
  category: Joi.string().hex().length(24).required(),
  localScore: Joi.number().min(0).required(),
  visitorScore: Joi.number().min(0).required(),
  date: Joi.date().required(),
});
