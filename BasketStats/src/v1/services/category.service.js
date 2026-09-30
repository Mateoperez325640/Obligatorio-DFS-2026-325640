import Categoria from "../models/category.model.js";

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
