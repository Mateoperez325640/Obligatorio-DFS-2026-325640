export const middlewareErrores = (err, req, res, next) => {
  if (err.isJoi) {
    return res.status(400).json({
      message: "Error de validación",
      errors: err.details.map((detail) => detail.message),
    });
  }

  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({
      message: err.message,
    });
  }

  const status = err.statusCode || err.status || 500;

  return res.status(status).json({
    message:
      status >= 500
        ? "Error interno del servidor"
        : err.publicMessage || err.message,
  });
};
