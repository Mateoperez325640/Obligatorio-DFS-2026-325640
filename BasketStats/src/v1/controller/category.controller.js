import {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
  modificarCategoria,
  eliminarCategoria,
} from "../services/category.service.js";

export const crear = async (req, res, next) => {
  try {
    const categoria = await crearCategoria(req.body);

    return res.status(201).json({
      message: "Categoría creada correctamente",
      categoria,
    });
  } catch (error) {
    return next(error);
  }
};

export const obtenerTodas = async (req, res, next) => {
  try {
    const categorias = await obtenerCategorias();

    return res.status(200).json({
      categorias,
    });
  } catch (error) {
    return next(error);
  }
};

export const obtenerPorId = async (req, res, next) => {
  try {
    const categoriaId = req.params.id;

    const categoria = await obtenerCategoriaPorId(categoriaId);

    return res.status(200).json({
      categoria,
    });
  } catch (error) {
    return next(error);
  }
};

export const modificar = async (req, res, next) => {
  try {
    const categoriaId = req.params.id;

    const categoria = await modificarCategoria(categoriaId, req.body);

    return res.status(200).json({
      message: "Categoría modificada correctamente",
      categoria,
    });
  } catch (error) {
    return next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    const categoriaId = req.params.id;

    await eliminarCategoria(categoriaId);

    return res.status(200).json({
      message: "Categoría eliminada correctamente",
    });
  } catch (error) {
    return next(error);
  }
};
