import {
  createCommentService,
  deleteCommentService,
  getAllCommentsService,
  getCommentsByAuthorIdService,
  getCommentsByPostIdService,
  updateCommentService,
} from "../Services/commentsServices.js";

export const getComments = async (req, res, next) => {
  try {
    const comments = await getAllCommentsService();
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

export const getCommenttById = async (req, res, next) => {
  try {
    res.json(req.comment);
  } catch (error) {
    next(error);
  }
};

export const getCommentByAuthorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comments = await getCommentsByAuthorIdService(id);
    if (comments.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontraron Comentarios para ese autor",
      });
    }
    res.status(200).json({
      mensaje: "Los comentarios se encontraron exitosamente",
      comments,
    });
  } catch (error) {
    next(error);
  }
};

export const getCommentsByPostId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comments = await getCommentsByPostIdService(id);
    if (comments.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontraron Comentarios para ese Post",
      });
    }
    res.status(200).json({
      mensaje: "Los comentarios del Post se encontraron exitosamente",
      comments,
    });
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const newComment = await createCommentService(req.body);
    res
      .status(201)
      .json({ mensaje: "Comentario Creado con exito", newComment });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const updated = await updateCommentService(req.params.id, req.body);
    res.json({ mensaje: "Comentario Actualizado con Exito", updated });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    await deleteCommentService(req.params.id);
    res.json({ mensaje: "Comentario eliminado existosamente" });
  } catch (error) {
    next(error);
  }
};

export const publishPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await publishPostService(id);
    if (!post) {
      return res.status(404).json({ mensaje: "Post no encontrado" });
    }

    res.status(200).json({ mensaje: "Post Actualizado correctamente", post });
  } catch (error) {
    next(error);
  }
};
