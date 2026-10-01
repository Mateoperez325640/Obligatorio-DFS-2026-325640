import { mensajesJoi } from "../config/joi-message.js";

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      messages: mensajesJoi,
    });

    if (error) {
      return res.status(400).json({
        message: "Error de validación",
        errors: error.details.map((detail) => detail.message),
      });
    }

    next();
  };
};

export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params, {
      abortEarly: false,
      messages: mensajesJoi,
    });

    if (error) {
      return res.status(400).json({
        message: "Error de validación",
        errors: error.details.map((detail) => detail.message),
      });
    }

    next();
  };
};

export default validate;
