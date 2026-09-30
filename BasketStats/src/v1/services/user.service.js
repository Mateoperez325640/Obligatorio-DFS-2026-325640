import User from "../models/user.model.js";

export const cambiarPlanUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    throw error;
  }

  if (user.plan !== "plus") {
    const error = new Error("El usuario ya tiene plan premium");
    error.statusCode = 400;
    throw error;
  }

  user.plan = "premium";

  await user.save();

  return user;
};
