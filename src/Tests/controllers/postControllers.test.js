// src/Tests/controllers/postsControllers.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getPosts,
  getPostById,
  getPostByAuthorID,
  createPost,
  deletePost,
  publishPost,
} from "../../Controllers/postsControllers.js";

vi.mock("../../Services/postsServices.js", () => ({
  getAllPostsService: vi.fn(),
  getPostByAuthorIdService: vi.fn(),
  createPostService: vi.fn(),
  updatePostService: vi.fn(),
  deletePostService: vi.fn(),
  publishPostService: vi.fn(),
}));

import {
  getAllPostsService,
  getPostByAuthorIdService,
  createPostService,
  deletePostService,
  publishPostService,
} from "../../Services/postsServices.js";

const mockRes = () => ({ status: vi.fn().mockReturnThis(), json: vi.fn() });
const mockNext = vi.fn();

beforeEach(() => vi.clearAllMocks());

// -------------------------
// getPosts
// -------------------------
describe("getPosts", () => {
  it("debe responder con la lista de posts", async () => {
    const fakePosts = [{ id: 1, title: "Post 1" }];
    getAllPostsService.mockResolvedValue(fakePosts);

    const res = mockRes();
    await getPosts({}, res, mockNext);

    expect(res.json).toHaveBeenCalledWith(fakePosts);
  });

  it("debe llamar next() si el service lanza un error", async () => {
    const error = new Error("DB error");
    getAllPostsService.mockRejectedValue(error);

    await getPosts({}, mockRes(), mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

// -------------------------
// getPostById
// -------------------------
describe("getPostById", () => {
  it("debe responder con el post de req.post", async () => {
    const fakePost = { id: 1, title: "Post 1" };
    const req = { post: fakePost };
    const res = mockRes();

    await getPostById(req, res, mockNext);

    expect(res.json).toHaveBeenCalledWith(fakePost);
  });

  it("debe llamar next() si ocurre un error", async () => {
    const error = new Error("Error inesperado");
    const req = {
      get post() {
        throw error;
      },
    };

    await getPostById(req, mockRes(), mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

// -------------------------
// getPostByAuthorID
// -------------------------
describe("getPostByAuthorID", () => {
  it("debe responder 200 con los posts del autor", async () => {
    const fakePosts = [{ id: 1, title: "Post 1" }];
    getPostByAuthorIdService.mockResolvedValue(fakePosts);

    const req = { params: { id: "1" } };
    const res = mockRes();

    await getPostByAuthorID(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Los posts se encontraron exitosamente",
      posts: fakePosts,
    });
  });

  it("debe responder 404 si el autor no tiene posts", async () => {
    getPostByAuthorIdService.mockResolvedValue([]);

    const req = { params: { id: "999" } };
    const res = mockRes();

    await getPostByAuthorID(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "No se encontraron posts para ese autor",
    });
  });

  it("debe llamar next() si el service lanza un error", async () => {
    const error = new Error("DB error");
    getPostByAuthorIdService.mockRejectedValue(error);

    await getPostByAuthorID({ params: { id: "1" } }, mockRes(), mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

// -------------------------
// createPost
// -------------------------
describe("createPost", () => {
  it("debe responder 201 con el post creado", async () => {
    const body = { title: "Post 1", content: "Contenido", author_id: 1 };
    const fakePost = { id: 1, ...body };
    createPostService.mockResolvedValue(fakePost);

    const req = { body };
    const res = mockRes();

    await createPost(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Post Creado con exito",
      newPost: fakePost,
    });
  });

  it("debe llamar next() si el service lanza un error", async () => {
    const error = new Error("DB error");
    createPostService.mockRejectedValue(error);

    await createPost({ body: {} }, mockRes(), mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

// -------------------------
// deletePost
// -------------------------
describe("deletePost", () => {
  it("debe responder con mensaje de éxito al eliminar", async () => {
    deletePostService.mockResolvedValue(1);

    const req = { params: { id: "1" } };
    const res = mockRes();

    await deletePost(req, res, mockNext);

    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Post eliminado existosamente",
    });
  });

  it("debe llamar next() si el service lanza un error", async () => {
    const error = new Error("DB error");
    deletePostService.mockRejectedValue(error);

    await deletePost({ params: { id: "1" } }, mockRes(), mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

// -------------------------
// publishPost
// -------------------------
describe("publishPost", () => {
  it("debe responder 200 con el post publicado", async () => {
    const fakePost = { id: 1, title: "Post 1", published: true };
    publishPostService.mockResolvedValue(fakePost);

    const req = { params: { id: "1" } };
    const res = mockRes();

    await publishPost(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Post Actualizado correctamente",
      post: fakePost,
    });
  });

  it("debe responder 404 si el post no existe", async () => {
    publishPostService.mockResolvedValue(undefined);

    const req = { params: { id: "999" } };
    const res = mockRes();

    await publishPost(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Post no encontrado" });
  });

  it("debe llamar next() si el service lanza un error", async () => {
    const error = new Error("DB error");
    publishPostService.mockRejectedValue(error);

    await publishPost({ params: { id: "1" } }, mockRes(), mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
