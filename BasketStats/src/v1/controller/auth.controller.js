import { registrarUser, loginUser } from "../services/auth.service.js";
import { generarToken } from "../utils/jwt.util.js";

export const registro = async (req, res, next) => {
  try {
    const user = await registrarUser(req.body);

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user,
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
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
    return next(error);
  }
};
