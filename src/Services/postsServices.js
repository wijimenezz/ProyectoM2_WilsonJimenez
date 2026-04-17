import { pool } from "../db.js";

export const getAllPostsService = async () => {
  const { rows } = await pool.query(
    "SELECT posts.*, authors.name FROM posts JOIN authors ON posts.author_id = authors.id",
  );
  return rows;
};

export const getPostByIdService = async (id) => {
  const { rows } = await pool.query(
    "SELECT posts.*, authors.name FROM posts JOIN authors ON posts.author_id = authors.id WHERE posts.id= $1",
    [id],
  );
  return rows[0];
};

export const getPostByAuthorIdService = async (authorId) => {
  const { rows } = await pool.query(
    "SELECT posts.*, authors.name, authors.email FROM posts JOIN authors ON posts.author_id = authors.id WHERE authors.id= $1",
    [authorId],
  );
  return rows;
};

export const createPostService = async (datos) => {
  const { rows } = await pool.query(
    "INSERT INTO posts (title, content, author_id, published) VALUES ($1,$2,$3,$4) RETURNING *",
    [datos.title, datos.content, datos.author_id, datos.published ?? false],
  );
  return rows[0];
};

export const updatePostService = async (id, datos) => {
  const { rows } = await pool.query(
    "UPDATE posts SET tittle = $1, content = $2 WHERE id = $3 RETURNING *",
    [datos.title, datos.content, id],
  );
  return rows[0];
};

export const deletePostService = async (id) => {
  const result = await pool.query("DELETE FROM posts WHERE id = $1", [id]);
  return result.rowCount;
};

export const publishPostService = async (postId) => {
  const { rows } = await pool.query(
    "UPDATE posts SET published = true WHERE id = $1 RETURNING *",
    [postId],
  );
  return rows[0];
};
