import { registrarUser } from "../services/auth.service.js";

export const registro = async (req, res) => {
  try {
    const user = await registrarUser(req.body);

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Error interno del servidor",
    });
  }
};
