import Joi from "joi";

export const anioParamSchema = Joi.object({
  anio: Joi.number().integer().min(1).required(),
});
