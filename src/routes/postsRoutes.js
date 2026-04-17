import { Router } from "express";
import {
  createPost,
  deletePost,
  getPostByAuthorID,
  getPostById,
  getPosts,
  publishPost,
  updatePost,
} from "../controllers/postsControllers.js";
import { validateId } from "../Middlewares/globalMiddleware.js";
import {
  validateDataPost,
  validatePost,
  validatePostsByAuthorId,
} from "../Middlewares/postsMiddlewares.js";
const router = Router();

router.get("/:id", validateId, validatePost, getPostById);
router.get("/", getPosts);
router.get("/authors/:id", validatePostsByAuthorId, getPostByAuthorID);

router.post("/", validateDataPost, createPost);

router.put("/:id", validateId, validatePost, updatePost);

router.delete("/:id", validateId, validatePost, deletePost);

router.patch("/publish/:id", validateId, publishPost);

export default router;
