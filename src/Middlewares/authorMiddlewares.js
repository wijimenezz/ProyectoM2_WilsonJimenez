import { getAuthorByIdService } from "../Services/autorServices.js";

export const validateAuthor = async (req, res, next) => {
  const author = await getAuthorByIdService(req.params.id);
  if (!author) {
    return res.status(404).json({ mensaje: "Autor no encontrado" });
  }

  req.author = author;
  next();
};

export const validateDataAuthor = (req, res, next) => {
  const { name, email, bio } = req.body;

  if (!name || name.trim().length < 3) {
    return res.status(400).json({
      mensaje: "El nombre es obligatorio y debe tener al menos 3 caracteres",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      mensaje: "El email no es válido",
    });
  }

  if (!bio || bio.trim().length < 10) {
    return res.status(400).json({
      mensaje: "La biografía debe tener al menos 10 caracteres",
    });
  }

  next();
};
