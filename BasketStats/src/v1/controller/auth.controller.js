import { registrarUser, loginUser } from "../services/auth.service.js";
import { generarToken } from "../utils/jwt.util.js";

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

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await loginUser(username, password);

    const token = generarToken(user);

    return res.status(200).json({
      message: "Login correcto",
      user,
      token,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Error interno del servidor",
    });
  }
};
