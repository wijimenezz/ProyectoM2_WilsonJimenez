import { pool } from "../db.js";

export const getAllCommentsService = async () => {
  const { rows } =
    await pool.query(`SELECT c.*, a.name, p.title FROM comments c 
        JOIN authors a ON c.author_id = a.id 
        JOIN posts p ON c.post_id = p.id`);
  return rows;
};

export const getCommentsByIdService = async (id) => {
  const { rows } = await pool.query(
    `SELECT c.*, a.name, p.title FROM comments c
        JOIN authors a ON c.author_id = a.id
        JOIN posts p ON c.post_id = p.id
        WHERE c.id = $1`,
    [id],
  );
  return rows[0];
};

export const getCommentsByPostIdService = async (postId) => {
  const { rows } = await pool.query(
    `SELECT c.*, a.name FROM comments c
        JOIN authors a ON c.author_id = a.id
        WHERE c.post_id = $1`,
    [postId],
  );
  return rows;
};

export const getCommentsByAuthorIdService = async (authorId) => {
  const { rows } = await pool.query(
    `SELECT c.*, p.title, p.id, a.name FROM comments c
        JOIN posts p ON c.post_id = p.id
        JOIN authors a ON c.author_id = a.id
        WHERE c.author_id = $1 `,
    [authorId],
  );
  return rows;
};

export const createCommentService = async (datos) => {
  const { rows } = await pool.query(
    `INSERT INTO comments (content, post_id, author_id) VALUES ($1, $2, $3) RETURNING *`,
    [datos.content, datos.post_id, datos.author_id],
  );
  return rows[0];
};

export const updateCommentService = async (id, datos) => {
  const { rows } = await pool.query(
    `UPDATE COMMENTS SET content = $1 WHERE id = $2 RETURNING *`,
    [datos.content, id],
  );
  return rows[0];
};

export const deleteCommentService = async (id) => {
  const result = await pool.query(`DELETE FROM comments WHERE id = $1`, [id]);
  return result.rowCount;
};
