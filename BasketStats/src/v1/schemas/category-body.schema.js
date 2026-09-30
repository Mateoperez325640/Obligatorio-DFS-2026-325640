import Joi from "joi";

export const categoriaBodySchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
});
