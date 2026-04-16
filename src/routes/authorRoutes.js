import { Router } from "express";
import { createAuthor, deleteAuthor, getAuthorById, getAuthors, updateAuthor } from "../controllers/authorControllers.js";
import { validateAuthor, validateDataAuthor } from "../Middlewares/authorMiddlewares.js";
import { validateId } from "../Middlewares/globalMiddleware.js";
const router = Router();


router.get ("/:id", validateId, validateAuthor,getAuthorById, );

router.get ("/", getAuthors);

router.post ("/", validateDataAuthor ,createAuthor);

router.put ("/:id", validateId, validateAuthor,updateAuthor);

router.delete ("/:id",validateId, validateAuthor ,deleteAuthor);

export default router;

