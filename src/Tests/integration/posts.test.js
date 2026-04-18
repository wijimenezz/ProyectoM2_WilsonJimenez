// src/Tests/integration/posts.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../app.js";

vi.mock("../../db.js", () => ({
  pool: { query: vi.fn() },
}));

import { pool } from "../../db.js";

beforeEach(() => vi.clearAllMocks());

describe("POSTS - Integration", () => {
  // GET /api/posts
  it("GET /api/posts → debe retornar 200 con lista de posts", async () => {
    const fakePosts = [
      { id: 1, title: "Post 1", content: "Contenido", name: "Juan" },
    ];
    pool.query.mockResolvedValue({ rows: fakePosts });

    const response = await request(app).get("/api/posts");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakePosts);
  });

  // GET /api/posts/:id
  it("GET /api/posts/:id → debe retornar 200 con el post", async () => {
    const fakePost = { id: 1, title: "Post 1", name: "Juan" };
    pool.query.mockResolvedValue({ rows: [fakePost] });

    const response = await request(app).get("/api/posts/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakePost);
  });

  it("GET /api/posts/:id → debe retornar 404 si el post no existe", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const response = await request(app).get("/api/posts/999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("mensaje", "Post no encontrado");
  });

  it("GET /api/posts/:id → debe retornar 400 si el id no es válido", async () => {
    const response = await request(app).get("/api/posts/abc");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "ID inválido, debe ser un número entero",
    );
  });

  // GET /api/posts/authors/:id
  it("GET /api/posts/authors/:id → debe retornar 200 con posts del autor", async () => {
    const fakePosts = [{ id: 1, title: "Post 1", name: "Juan" }];
    pool.query.mockResolvedValue({ rows: fakePosts });

    const response = await request(app).get("/api/posts/authors/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "mensaje",
      "Los posts se encontraron exitosamente",
    );
    expect(response.body.posts).toEqual(fakePosts);
  });

  it("GET /api/posts/authors/:id → debe retornar 404 si el autor no tiene posts", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const response = await request(app).get("/api/posts/authors/999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "mensaje",
      "No se encontraron posts para ese autor",
    );
  });

  // POST /api/posts
  it("POST /api/posts → debe retornar 201 con el post creado", async () => {
    const body = {
      title: "Post 1",
      content: "Contenido suficiente",
      author_id: 1,
    };
    const fakePost = { id: 1, ...body, published: false };
    pool.query.mockResolvedValue({ rows: [fakePost] });

    const response = await request(app).post("/api/posts").send(body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("mensaje", "Post Creado con exito");
    expect(response.body.newPost).toEqual(fakePost);
  });

  it("POST /api/posts → debe retornar 400 si el titulo es muy corto", async () => {
    const response = await request(app)
      .post("/api/posts")
      .send({ title: "Ti", content: "Contenido suficiente", author_id: 1 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "mensaje",
      "El Titulo es obligatorio y debe tener al menos 3 caracteres",
    );
  });

  it("POST /api/posts → debe retornar 400 si falta el author_id", async () => {
    const response = await request(app)
      .post("/api/posts")
      .send({ title: "Titulo válido", content: "Contenido suficiente" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "mensaje",
      "author_id debe ser un número válido",
    );
  });

  // PUT /api/posts/:id
  it("PUT /api/posts/:id → debe retornar 200 con el post actualizado", async () => {
    const body = {
      title: "Titulo actualizado",
      content: "Contenido actualizado",
    };
    const fakePost = { id: 1, ...body };
    pool.query
      .mockResolvedValueOnce({ rows: [fakePost] }) // validatePost middleware
      .mockResolvedValueOnce({ rows: [fakePost] }); // update

    const response = await request(app).put("/api/posts/1").send(body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "mensaje",
      "Post Actualizado con Exito",
    );
  });

  it("PUT /api/posts/:id → debe retornar 404 si el post no existe", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const response = await request(app)
      .put("/api/posts/999")
      .send({ title: "Titulo válido", content: "Contenido suficiente" });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("mensaje", "Post no encontrado");
  });

  // DELETE /api/posts/:id
  it("DELETE /api/posts/:id → debe retornar 200 al eliminar", async () => {
    const fakePost = { id: 1, title: "Post 1" };
    pool.query
      .mockResolvedValueOnce({ rows: [fakePost] }) // validatePost middleware
      .mockResolvedValueOnce({ rowCount: 1 }); // delete

    const response = await request(app).delete("/api/posts/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "mensaje",
      "Post eliminado existosamente",
    );
  });

  // PATCH /api/posts/publish/:id
  it("PATCH /api/posts/publish/:id → debe retornar 200 con el post publicado", async () => {
    const fakePost = { id: 1, title: "Post 1", published: true };
    pool.query.mockResolvedValue({ rows: [fakePost] });

    const response = await request(app).patch("/api/posts/publish/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "mensaje",
      "Post Actualizado correctamente",
    );
    expect(response.body.post).toEqual(fakePost);
  });

  it("PATCH /api/posts/publish/:id → debe retornar 404 si el post no existe", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const response = await request(app).patch("/api/posts/publish/999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("mensaje", "Post no encontrado");
  });
});
