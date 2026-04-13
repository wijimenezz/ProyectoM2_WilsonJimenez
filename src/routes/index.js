
import { Router } from "express";
import authorRoutes from "./authorRoutes.js";

const router = Router();
router.use("/authors", authorRoutes);

export default router;

