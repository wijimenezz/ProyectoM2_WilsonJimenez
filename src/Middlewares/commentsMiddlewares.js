import { getCommentsByIdService } from "../Services/commentsServices.js";

export const validateComments = async (req, res, next) => {
  const comment = await getCommentsByIdService(req.params.id);
  if (!comment) {
    return res.status(404).json({ mensaje: "Comentario no encontrado" });
  }

  req.comment = comment;
  next();
};

export const validateDataComment = (req, res, next) => {
  const { content } = req.body;

  if (!content || content.trim().length < 5) {
    return res.status(400).json({
      mensaje:
        "El comentario es obligatorio y debe tener al menos 3 caracteres",
    });
  }
  next();
};

export const validateCommentByAuthorPostId = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      mensaje: "El ID del autor es requerido y debe ser un número válido.",
    });
  }

  next();
};
