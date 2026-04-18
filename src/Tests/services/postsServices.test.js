// src/Tests/services/postsServices.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllPostsService,
  getPostByIdService,
  getPostByAuthorIdService,
  createPostService,
  updatePostService,
  deletePostService,
  publishPostService,
} from "../../Services/postsServices.js";

vi.mock("../../db.js", () => ({
  pool: { query: vi.fn() },
}));

import { pool } from "../../db.js";

beforeEach(() => vi.clearAllMocks());

// -------------------------
// getAllPostsService
// -------------------------
describe("getAllPostsService", () => {
  it("debe retornar todos los posts", async () => {
    const fakePosts = [
      { id: 1, title: "Post 1", name: "Juan" },
      { id: 2, title: "Post 2", name: "Ana" },
    ];
    pool.query.mockResolvedValue({ rows: fakePosts });

    const result = await getAllPostsService();

    expect(result).toEqual(fakePosts);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  it("debe retornar array vacío si no hay posts", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await getAllPostsService();

    expect(result).toEqual([]);
  });
});

// -------------------------
// getPostByIdService
// -------------------------
describe("getPostByIdService", () => {
  it("debe retornar un post por id", async () => {
    const fakePost = { id: 1, title: "Post 1", name: "Juan" };
    pool.query.mockResolvedValue({ rows: [fakePost] });

    const result = await getPostByIdService(1);

    expect(result).toEqual(fakePost);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("WHERE posts.id= $1"),
      [1],
    );
  });

  it("debe retornar undefined si el post no existe", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await getPostByIdService(999);

    expect(result).toBeUndefined();
  });
});

// -------------------------
// getPostByAuthorIdService
// -------------------------
describe("getPostByAuthorIdService", () => {
  it("debe retornar posts de un autor", async () => {
    const fakePosts = [{ id: 1, title: "Post 1", name: "Juan" }];
    pool.query.mockResolvedValue({ rows: fakePosts });

    const result = await getPostByAuthorIdService(1);

    expect(result).toEqual(fakePosts);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("WHERE authors.id= $1"),
      [1],
    );
  });

  it("debe retornar array vacío si el autor no tiene posts", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await getPostByAuthorIdService(999);

    expect(result).toEqual([]);
  });
});

// -------------------------
// createPostService
// -------------------------
describe("createPostService", () => {
  it("debe crear un post y retornarlo", async () => {
    const datos = { title: "Post 1", content: "Contenido", author_id: 1 };
    const fakePost = { id: 1, ...datos, published: false };
    pool.query.mockResolvedValue({ rows: [fakePost] });

    const result = await createPostService(datos);

    expect(result).toEqual(fakePost);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO posts"),
      [datos.title, datos.content, datos.author_id, false],
    );
  });

  it("debe usar published false por defecto", async () => {
    const datos = { title: "Post 1", content: "Contenido", author_id: 1 };
    pool.query.mockResolvedValue({ rows: [{ ...datos, published: false }] });

    await createPostService(datos);

    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [
      datos.title,
      datos.content,
      datos.author_id,
      false,
    ]);
  });
});

// -------------------------
// updatePostService
// -------------------------
describe("updatePostService", () => {
  it("debe actualizar un post y retornarlo", async () => {
    const datos = { title: "Post actualizado", content: "Contenido nuevo" };
    const fakePost = { id: 1, ...datos };
    pool.query.mockResolvedValue({ rows: [fakePost] });

    const result = await updatePostService(1, datos);

    expect(result).toEqual(fakePost);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE posts"),
      [datos.title, datos.content, 1],
    );
  });

  it("debe retornar undefined si el post no existe", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await updatePostService(999, {});

    expect(result).toBeUndefined();
  });
});

// -------------------------
// deletePostService
// -------------------------
describe("deletePostService", () => {
  it("debe eliminar un post y retornar rowCount 1", async () => {
    pool.query.mockResolvedValue({ rowCount: 1 });

    const result = await deletePostService(1);

    expect(result).toBe(1);
    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM posts WHERE id = $1",
      [1],
    );
  });

  it("debe retornar rowCount 0 si el post no existe", async () => {
    pool.query.mockResolvedValue({ rowCount: 0 });

    const result = await deletePostService(999);

    expect(result).toBe(0);
  });
});

// -------------------------
// publishPostService
// -------------------------
describe("publishPostService", () => {
  it("debe publicar un post y retornarlo", async () => {
    const fakePost = { id: 1, title: "Post 1", published: true };
    pool.query.mockResolvedValue({ rows: [fakePost] });

    const result = await publishPostService(1);

    expect(result).toEqual(fakePost);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("SET published = true"),
      [1],
    );
  });

  it("debe retornar undefined si el post no existe", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await publishPostService(999);

    expect(result).toBeUndefined();
  });
});
