import { Router } from "express";
import { createPost, deletePost, getPostByAuthorID, getPostById, getPosts, updatePost } from "../controllers/postsControllers.js";
import { validateId } from "../Middlewares/globalMiddleware.js";
import { validateDataPost, validatePost, validatePostsbyAuthorId } from "../Middlewares/postsMiddlewares.js";
const router = Router();


router.get ("/:id", validateId, validatePost, getPostById);
router.get ("/", getPosts);
router.get ("/authors/:authorId", validatePostsbyAuthorId, getPostByAuthorID )

router.post ("/", validateDataPost ,createPost);


router.put ("/:id", validateId, validatePost,updatePost);

router.delete ("/:id",validateId, validatePost ,deletePost);


export default router;
