// src/Tests/services/commentsServices.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllCommentsService,
  getCommentsByIdService,
  getCommentsByPostIdService,
  getCommentsByAuthorIdService,
  createCommentService,
  updateCommentService,
  deleteCommentService,
} from "../../Services/commentsServices.js";

vi.mock("../../db.js", () => ({
  pool: { query: vi.fn() },
}));

import { pool } from "../../db.js";

beforeEach(() => vi.clearAllMocks());

// -------------------------
// getAllCommentsService
// -------------------------
describe("getAllCommentsService", () => {
  it("debe retornar todos los comments", async () => {
    const fakeComments = [
      { id: 1, content: "Hola", name: "Juan", title: "Post 1" },
    ];
    pool.query.mockResolvedValue({ rows: fakeComments });

    const result = await getAllCommentsService();

    expect(result).toEqual(fakeComments);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  it("debe retornar array vacío si no hay comments", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await getAllCommentsService();

    expect(result).toEqual([]);
  });
});

// -------------------------
// getCommentsByIdService
// -------------------------
describe("getCommentsByIdService", () => {
  it("debe retornar un comment por id", async () => {
    const fakeComment = {
      id: 1,
      content: "Hola",
      name: "Juan",
      title: "Post 1",
    };
    pool.query.mockResolvedValue({ rows: [fakeComment] });

    const result = await getCommentsByIdService(1);

    expect(result).toEqual(fakeComment);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("WHERE c.id = $1"),
      [1],
    );
  });

  it("debe retornar undefined si el comment no existe", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await getCommentsByIdService(999);

    expect(result).toBeUndefined();
  });
});

// -------------------------
// getCommentsByPostIdService
// -------------------------
describe("getCommentsByPostIdService", () => {
  it("debe retornar comments de un post", async () => {
    const fakeComments = [{ id: 1, content: "Hola", name: "Juan" }];
    pool.query.mockResolvedValue({ rows: fakeComments });

    const result = await getCommentsByPostIdService(1);

    expect(result).toEqual(fakeComments);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("WHERE c.post_id = $1"),
      [1],
    );
  });

  it("debe retornar array vacío si el post no tiene comments", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await getCommentsByPostIdService(999);

    expect(result).toEqual([]);
  });
});

// -------------------------
// getCommentsByAuthorIdService
// -------------------------
describe("getCommentsByAuthorIdService", () => {
  it("debe retornar comments de un autor", async () => {
    const fakeComments = [{ id: 1, content: "Hola", title: "Post 1" }];
    pool.query.mockResolvedValue({ rows: fakeComments });

    const result = await getCommentsByAuthorIdService(1);

    expect(result).toEqual(fakeComments);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("WHERE c.author_id = $1"),
      [1],
    );
  });

  it("debe retornar array vacío si el autor no tiene comments", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await getCommentsByAuthorIdService(999);

    expect(result).toEqual([]);
  });
});

// -------------------------
// createCommentService
// -------------------------
describe("createCommentService", () => {
  it("debe crear un comment y retornarlo", async () => {
    const datos = { content: "Hola mundo", post_id: 1, author_id: 2 };
    const fakeComment = { id: 1, ...datos };
    pool.query.mockResolvedValue({ rows: [fakeComment] });

    const result = await createCommentService(datos);

    expect(result).toEqual(fakeComment);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO comments"),
      [datos.content, datos.post_id, datos.author_id],
    );
  });
});

// -------------------------
// updateCommentService
// -------------------------
describe("updateCommentService", () => {
  it("debe actualizar un comment y retornarlo", async () => {
    const datos = { content: "Contenido actualizado" };
    const fakeComment = { id: 1, ...datos };
    pool.query.mockResolvedValue({ rows: [fakeComment] });

    const result = await updateCommentService(1, datos);

    expect(result).toEqual(fakeComment);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("SET content = $1"),
      [datos.content, 1],
    );
  });

  it("debe retornar undefined si el comment no existe", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await updateCommentService(999, {});

    expect(result).toBeUndefined();
  });
});

// -------------------------
// deleteCommentService
// -------------------------
describe("deleteCommentService", () => {
  it("debe eliminar un comment y retornar rowCount 1", async () => {
    pool.query.mockResolvedValue({ rowCount: 1 });

    const result = await deleteCommentService(1);

    expect(result).toBe(1);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM comments"),
      [1],
    );
  });

  it("debe retornar rowCount 0 si el comment no existe", async () => {
    pool.query.mockResolvedValue({ rowCount: 0 });

    const result = await deleteCommentService(999);

    expect(result).toBe(0);
  });
});
