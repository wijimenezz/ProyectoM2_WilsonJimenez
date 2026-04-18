// src/Tests/integration/comments.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../app.js";

vi.mock("../../db.js", () => ({
  pool: { query: vi.fn() },
}));

import { pool } from "../../db.js";

beforeEach(() => vi.clearAllMocks());

describe("COMMENTS - Integration", () => {
  // GET /api/comments
  it("GET /api/comments → debe retornar 200 con lista de comments", async () => {
    const fakeComments = [
      { id: 1, content: "Hola mundo", name: "Juan", title: "Post 1" },
    ];
    pool.query.mockResolvedValue({ rows: fakeComments });

    const response = await request(app).get("/api/comments");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeComments);
  });

  // GET /api/comments/:id
  it("GET /api/comments/:id → debe retornar 200 con el comment", async () => {
    const fakeComment = {
      id: 1,
      content: "Hola mundo",
      name: "Juan",
      title: "Post 1",
    };
    pool.query.mockResolvedValue({ rows: [fakeComment] });

    const response = await request(app).get("/api/comments/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeComment);
  });

  it("GET /api/comments/:id → debe retornar 404 si el comment no existe", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const response = await request(app).get("/api/comments/999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("mensaje", "Comentario no encontrado");
  });

  it("GET /api/comments/:id → debe retornar 400 si el id no es válido", async () => {
    const response = await request(app).get("/api/comments/abc");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "ID inválido, debe ser un número entero",
    );
  });

  // GET /api/comments/authors/:id
  it("GET /api/comments/authors/:id → debe retornar 200 con comments del autor", async () => {
    const fakeComments = [{ id: 1, content: "Hola", title: "Post 1" }];
    pool.query.mockResolvedValue({ rows: fakeComments });

    const response = await request(app).get("/api/comments/authors/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "mensaje",
      "Los comentarios se encontraron exitosamente",
    );
    expect(response.body.comments).toEqual(fakeComments);
  });

  it("GET /api/comments/authors/:id → debe retornar 404 si el autor no tiene comments", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const response = await request(app).get("/api/comments/authors/999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "mensaje",
      "No se encontraron Comentarios para ese autor",
    );
  });

  // GET /api/comments/posts/:id
  it("GET /api/comments/posts/:id → debe retornar 200 con comments del post", async () => {
    const fakeComments = [{ id: 1, content: "Hola", name: "Juan" }];
    pool.query.mockResolvedValue({ rows: fakeComments });

    const response = await request(app).get("/api/comments/posts/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "mensaje",
      "Los comentarios del Post se encontraron exitosamente",
    );
    expect(response.body.comments).toEqual(fakeComments);
  });

  it("GET /api/comments/posts/:id → debe retornar 404 si el post no tiene comments", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const response = await request(app).get("/api/comments/posts/999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "mensaje",
      "No se encontraron Comentarios para ese Post",
    );
  });

  // POST /api/comments
  it("POST /api/comments → debe retornar 201 con el comment creado", async () => {
    const body = { content: "Hola mundo comment", post_id: 1, author_id: 2 };
    const fakeComment = { id: 1, ...body };
    pool.query.mockResolvedValue({ rows: [fakeComment] });

    const response = await request(app).post("/api/comments").send(body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "mensaje",
      "Comentario Creado con exito",
    );
    expect(response.body.newComment).toEqual(fakeComment);
  });

  it("POST /api/comments → debe retornar 400 si el content es muy corto", async () => {
    const response = await request(app)
      .post("/api/comments")
      .send({ content: "Hol", post_id: 1, author_id: 2 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("mensaje");
  });

  // PUT /api/comments/:id
  it("PUT /api/comments/:id → debe retornar 200 con el comment actualizado", async () => {
    const fakeComment = { id: 1, content: "Actualizado" };
    pool.query
      .mockResolvedValueOnce({ rows: [fakeComment] }) // validateComments middleware
      .mockResolvedValueOnce({ rows: [fakeComment] }); // update

    const response = await request(app)
      .put("/api/comments/1")
      .send({ content: "Actualizado" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "mensaje",
      "Comentario Actualizado con Exito",
    );
  });

  it("PUT /api/comments/:id → debe retornar 404 si el comment no existe", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const response = await request(app)
      .put("/api/comments/999")
      .send({ content: "Actualizado" });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("mensaje", "Comentario no encontrado");
  });

  // DELETE /api/comments/:id
  it("DELETE /api/comments/:id → debe retornar 200 al eliminar", async () => {
    const fakeComment = { id: 1, content: "Hola" };
    pool.query
      .mockResolvedValueOnce({ rows: [fakeComment] }) // validateComments middleware
      .mockResolvedValueOnce({ rowCount: 1 }); // delete

    const response = await request(app).delete("/api/comments/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "mensaje",
      "Comentario eliminado existosamente",
    );
  });

  it("DELETE /api/comments/:id → debe retornar 404 si el comment no existe", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const response = await request(app).delete("/api/comments/999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("mensaje", "Comentario no encontrado");
  });
});
