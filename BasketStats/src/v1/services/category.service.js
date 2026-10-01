import Categoria from "../models/category.model.js";
import Partido from "../models/match.model.js";

export const crearCategoria = async (categoriaData) => {
  const { name } = categoriaData;

  const existeCategoria = await Categoria.findOne({ name });

  if (existeCategoria) {
    const error = new Error("La categoría ya existe");
    error.statusCode = 409;
    throw error;
  }

  const categoria = await Categoria.create({
    name,
  });

  return categoria;
};

export const obtenerCategorias = async () => {
  const categorias = await Categoria.find();

  return categorias;
};

export const obtenerCategoriaPorId = async (categoriaId) => {
  const categoria = await Categoria.findById(categoriaId);

  if (!categoria) {
    const error = new Error("Categoría no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return categoria;
};

export const modificarCategoria = async (categoriaId, categoriaData) => {
  const { name } = categoriaData;

  const categoria = await Categoria.findById(categoriaId);

  if (!categoria) {
    const error = new Error("Categoría no encontrada");
    error.statusCode = 404;
    throw error;
  }

  const existeCategoria = await Categoria.findOne({ name });

  if (existeCategoria && existeCategoria.id !== categoria.id) {
    const error = new Error("La categoría ya existe");
    error.statusCode = 409;
    throw error;
  }

  categoria.name = name;

  await categoria.save();

  return categoria;
};

export const eliminarCategoria = async (categoriaId) => {
  const categoria = await Categoria.findById(categoriaId);

  if (!categoria) {
    const error = new Error("Categoría no encontrada");
    error.statusCode = 404;
    throw error;
  }

  const partidoConCategoria = await Partido.findOne({
    category: categoriaId,
  });

  if (partidoConCategoria) {
    const error = new Error(
      "No se puede eliminar la categoría porque está siendo utilizada",
    );
    error.statusCode = 409;
    throw error;
  }

  const categoriaEliminada = await Categoria.findByIdAndDelete(categoriaId);

  return categoriaEliminada;
};
