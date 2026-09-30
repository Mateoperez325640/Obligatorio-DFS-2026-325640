import { crearCategoria } from "../services/category.service.js";

export const crear = async (req, res) => {
  try {
    const categoria = await crearCategoria(req.body);

    return res.status(201).json({
      message: "Categoría creada correctamente",
      categoria,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Error interno del servidor",
    });
  }
};
