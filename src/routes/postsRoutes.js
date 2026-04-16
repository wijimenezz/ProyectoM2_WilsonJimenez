import { Router } from "express";
import { getPostById, getPosts } from "../controllers/postsControllers.js";
const router = Router();


router.get ("/", getPosts);
router.get ("/:id", getPostById);

export default router;
