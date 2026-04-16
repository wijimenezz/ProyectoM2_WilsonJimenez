import { Router } from "express";
import {pool} from "../db.js"
import { createAuthor, deleteAuthor, getAuthorById, getAuthors, updateAuthor } from "../controllers/authorControllers.js";
const router = Router();


router.get ("/", getAuthors);

router.get ("/:id", getAuthorById);

router.post ("/", createAuthor);

router.put ("/:id", updateAuthor);

router.delete ("/:id", deleteAuthor);

export default router;

