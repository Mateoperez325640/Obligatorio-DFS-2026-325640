import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const registrarUser = async (userData) => {
  const { name, username, email, password } = userData;

  const ExisteUserName = await User.findOne({ username });

  if (ExisteUserName) {
    const error = new Error("El nombre de usuario ya está registrado");
    error.statusCode = 409;
    throw error;
  }

  const ExisteEmail = await User.findOne({ email });

  if (ExisteEmail) {
    const error = new Error("El email ya está registrado");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
  });

  return user;
};
