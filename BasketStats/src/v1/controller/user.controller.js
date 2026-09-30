import { cambiarPlanUser } from "../services/user.service.js";

export const cambiarPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await cambiarPlanUser(userId);

    return res.status(200).json({
      message: "Plan actualizado correctamente",
      user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Error interno del servidor",
    });
  }
};
