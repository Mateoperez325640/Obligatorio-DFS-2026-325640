import cloudinary from "../config/cloudinary.config.js";

export const subirImagen = (file) => {
  return cloudinary.uploader.upload(file, {
    folder: "BasketStats",
    resource_type: "image",
  });
};

export const eliminarImagen = (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};
