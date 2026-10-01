import Joi from "joi";

export const jugadorBodySchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  team: Joi.string().hex().length(24).required(),
});
