import { Router } from "express";
import {
  validateCommentByAuthorPostId,
  validateComments,
  validateDataComment,
} from "../Middlewares/commentsMiddlewares.js";
import {
  createComment,
  deleteComment,
  getCommentByAuthorId,
  getComments,
  getCommentsByPostId,
  getCommenttById,
  updateComment,
} from "../controllers/commentsControllers.js";
import { validateId } from "../Middlewares/globalMiddleware.js";
const router = Router();

router.get("/:id", validateId, validateComments, getCommenttById);
router.get("/", getComments);

router.get("/authors/:id", validateCommentByAuthorPostId, getCommentByAuthorId);

router.get("/posts/:id", validateCommentByAuthorPostId, getCommentsByPostId);

router.post("/", validateDataComment, createComment);

router.put("/:id", validateId, validateComments, updateComment);

router.delete("/:id", validateId, validateComments, deleteComment);

export default router;
