import { subirImagen } from "../services/image.service.js";

export const subir = async (req, res, next) => {
  try {
    const { image } = req.body;

    if (
      typeof image !== "string" ||
      !/^data:image\/(jpeg|png|webp);base64,/.test(image)
    ) {
      return res.status(400).json({
        message: "Debés enviar una imagen válida en Base64.",
      });
    }

    const resultado = await subirImagen(image);

    return res.status(201).json({
      message: "Imagen subida correctamente",
      image: resultado.secure_url,
      publicId: resultado.public_id,
    });
  } catch (error) {
    return next(error);
  }
};
