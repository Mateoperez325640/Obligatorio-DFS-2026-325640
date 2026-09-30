import Joi from "joi";

export const registrarBodySchema = Joi.object({
  name: Joi.string().min(3).max(30).label("nombre").required(),

  username: Joi.string().alphanum().min(3).max(30).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(3).max(30).required(),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});
