import { Router } from "express";
import authorRoutes from "./authorRoutes.js";
import postRoutes from "./postsRoutes.js";
import commentsRoutes from "./commentsRoutes.js";

const router = Router();
router.use("/authors", authorRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentsRoutes);

export default router;
