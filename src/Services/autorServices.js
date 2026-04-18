import { json } from "express";
import { pool } from "../db.js";

export const getAllAuthorsService = async () => {
  const { rows } = await pool.query("SELECT * FROM authors");
  return rows;
};

export const getAuthorByIdService = async (id) => {
  const { rows } = await pool.query("SELECT * FROM authors WHERE id= $1", [id]);
  return rows[0];
};

export const createAuthorService = async (datos) => {
  const { rows } = await pool.query(
    "INSERT INTO authors (name, email, bio) VALUES ($1,$2,$3) RETURNING *",
    [datos.name, datos.email, datos.bio],
  );
  return rows[0];
};

export const updateAuthorService = async (id, datos) => {
  const { rows } = await pool.query(
    "UPDATE authors SET name = $1, email = $2, bio = $3 WHERE id = $4 RETURNING *",
    [datos.name, datos.email, datos.bio, id],
  );
  return rows[0];
};

export const deleteauthorService = async (id) => {
  const result = await pool.query("DELETE FROM authors WHERE id = $1", [id]);
  return result.rowCount;
};
