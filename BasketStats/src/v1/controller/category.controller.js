import {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
  modificarCategoria,
} from "../services/category.service.js";

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

export const obtenerTodas = async (req, res) => {
  try {
    const categorias = await obtenerCategorias();

    return res.status(200).json({
      categorias,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Error interno del servidor",
    });
  }
};

export const obtenerPorId = async (req, res) => {
  try {
    const categoriaId = req.params.id;

    const categoria = await obtenerCategoriaPorId(categoriaId);

    return res.status(200).json({
      categoria,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Error interno del servidor",
    });
  }
};

export const modificar = async (req, res) => {
  try {
    const categoriaId = req.params.id;

    const categoria = await modificarCategoria(categoriaId, req.body);

    return res.status(200).json({
      message: "Categoría modificada correctamente",
      categoria,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Error interno del servidor",
    });
  }
};
