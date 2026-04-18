// src/Tests/integration/authors.test.js
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app.js";

// Mockea la DB para no conectarte a postgres real
vi.mock("../../db.js", () => ({
  pool: {
    query: vi.fn(),
  },
}));

import { pool } from "../../db.js";

describe("AUTHORS - Integration", () => {
  beforeAll(() => vi.clearAllMocks());

  // GET /api/authors
  it("GET /api/authors → debe retornar 200 con lista de autores", async () => {
    const fakeAuthors = [
      { id: 1, name: "Juan", email: "juan@mail.com", bio: "Escritor" },
    ];
    pool.query.mockResolvedValue({ rows: fakeAuthors });

    const response = await request(app).get("/api/authors");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeAuthors);
  });

  // GET /api/authors/:id
  it("GET /api/authors/:id → debe retornar 200 con el autor", async () => {
    const fakeAuthor = {
      id: 1,
      name: "Juan",
      email: "juan@mail.com",
      bio: "Escritor",
    };
    pool.query.mockResolvedValue({ rows: [fakeAuthor] });

    const response = await request(app).get("/api/authors/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeAuthor);
  });

  it("GET /api/authors/:id → debe retornar 404 si no existe", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const response = await request(app).get("/api/authors/999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("mensaje", "Autor no encontrado");
  });

  // POST /api/authors
  it("POST /api/authors → debe retornar 201 con el autor creado", async () => {
    const body = {
      name: "Juan",
      email: "juan@mail.com",
      bio: "Escritor con experiencia",
    };
    const fakeAuthor = { id: 1, ...body };
    pool.query.mockResolvedValue({ rows: [fakeAuthor] });

    const response = await request(app).post("/api/authors").send(body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("mensaje", "Autor Creado con exito");
    expect(response.body.newAuthor).toEqual(fakeAuthor);
  });

  it("POST /api/authors → debe retornar 400 si el body es inválido", async () => {
    const response = await request(app)
      .post("/api/authors")
      .send({ name: "Ju" }); // nombre muy corto

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("mensaje");
  });

  // PUT /api/authors/:id
  it("PUT /api/authors/:id → debe retornar 200 con el autor actualizado", async () => {
    const body = {
      name: "Juan Updated",
      email: "juan@mail.com",
      bio: "Escritor actualizado",
    };
    const fakeAuthor = { id: 1, ...body };
    // Primera query es del middleware validateAuthor, segunda del update
    pool.query
      .mockResolvedValueOnce({ rows: [fakeAuthor] }) // middleware
      .mockResolvedValueOnce({ rows: [fakeAuthor] }); // update

    const response = await request(app).put("/api/authors/1").send(body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "mensaje",
      "Autor Actualizado con Exito",
    );
  });

  // DELETE /api/authors/:id
  it("DELETE /api/authors/:id → debe retornar 200 al eliminar", async () => {
    const fakeAuthor = { id: 1, name: "Juan" };
    pool.query
      .mockResolvedValueOnce({ rows: [fakeAuthor] }) // middleware
      .mockResolvedValueOnce({ rowCount: 1 }); // delete

    const response = await request(app).delete("/api/authors/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "mensaje",
      "autor eliminado existosamente",
    );
  });
});
