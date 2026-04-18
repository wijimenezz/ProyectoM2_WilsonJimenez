// src/Tests/controllers/commentsControllers.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getComments,
  getCommenttById,
  getCommentByAuthorId,
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
} from "../../Controllers/commentsControllers.js";

vi.mock("../../Services/commentsServices.js", () => ({
  getAllCommentsService: vi.fn(),
  getCommentsByAuthorIdService: vi.fn(),
  getCommentsByPostIdService: vi.fn(),
  createCommentService: vi.fn(),
  updateCommentService: vi.fn(),
  deleteCommentService: vi.fn(),
}));

import {
  getAllCommentsService,
  getCommentsByAuthorIdService,
  getCommentsByPostIdService,
  createCommentService,
  updateCommentService,
  deleteCommentService,
} from "../../Services/commentsServices.js";

const mockRes = () => ({ status: vi.fn().mockReturnThis(), json: vi.fn() });
const mockNext = vi.fn();

beforeEach(() => vi.clearAllMocks());

// -------------------------
// getComments
// -------------------------
describe("getComments", () => {
  it("debe responder con la lista de comments", async () => {
    const fakeComments = [{ id: 1, content: "Hola" }];
    getAllCommentsService.mockResolvedValue(fakeComments);

    const res = mockRes();
    await getComments({}, res, mockNext);

    expect(res.json).toHaveBeenCalledWith(fakeComments);
  });

  it("debe llamar next() si el service lanza un error", async () => {
    const error = new Error("DB error");
    getAllCommentsService.mockRejectedValue(error);

    await getComments({}, mockRes(), mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

// -------------------------
// getCommenttById
// -------------------------
describe("getCommenttById", () => {
  it("debe responder con el comment de req.comment", async () => {
    const fakeComment = { id: 1, content: "Hola" };
    const req = { comment: fakeComment };
    const res = mockRes();

    await getCommenttById(req, res, mockNext);

    expect(res.json).toHaveBeenCalledWith(fakeComment);
  });

  it("debe llamar next() si ocurre un error", async () => {
    const error = new Error("Error inesperado");
    const req = {
      get comment() {
        throw error;
      },
    };

    await getCommenttById(req, mockRes(), mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

// -------------------------
// getCommentByAuthorId
// -------------------------
describe("getCommentByAuthorId", () => {
  it("debe responder 200 con los comments del autor", async () => {
    const fakeComments = [{ id: 1, content: "Hola" }];
    getCommentsByAuthorIdService.mockResolvedValue(fakeComments);

    const req = { params: { id: "1" } };
    const res = mockRes();

    await getCommentByAuthorId(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Los comentarios se encontraron exitosamente",
      comments: fakeComments,
    });
  });

  it("debe responder 404 si el autor no tiene comments", async () => {
    getCommentsByAuthorIdService.mockResolvedValue([]);

    const req = { params: { id: "999" } };
    const res = mockRes();

    await getCommentByAuthorId(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "No se encontraron Comentarios para ese autor",
    });
  });

  it("debe llamar next() si el service lanza un error", async () => {
    const error = new Error("DB error");
    getCommentsByAuthorIdService.mockRejectedValue(error);

    await getCommentByAuthorId({ params: { id: "1" } }, mockRes(), mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

// -------------------------
// getCommentsByPostId
// -------------------------
describe("getCommentsByPostId", () => {
  it("debe responder 200 con los comments del post", async () => {
    const fakeComments = [{ id: 1, content: "Hola" }];
    getCommentsByPostIdService.mockResolvedValue(fakeComments);

    const req = { params: { id: "1" } };
    const res = mockRes();

    await getCommentsByPostId(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Los comentarios del Post se encontraron exitosamente",
      comments: fakeComments,
    });
  });

  it("debe responder 404 si el post no tiene comments", async () => {
    getCommentsByPostIdService.mockResolvedValue([]);

    const req = { params: { id: "999" } };
    const res = mockRes();

    await getCommentsByPostId(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "No se encontraron Comentarios para ese Post",
    });
  });

  it("debe llamar next() si el service lanza un error", async () => {
    const error = new Error("DB error");
    getCommentsByPostIdService.mockRejectedValue(error);

    await getCommentsByPostId({ params: { id: "1" } }, mockRes(), mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

// -------------------------
// createComment
// -------------------------
describe("createComment", () => {
  it("debe responder 201 con el comment creado", async () => {
    const body = { content: "Hola mundo", post_id: 1, author_id: 2 };
    const fakeComment = { id: 1, ...body };
    createCommentService.mockResolvedValue(fakeComment);

    const req = { body };
    const res = mockRes();

    await createComment(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Comentario Creado con exito",
      newComment: fakeComment,
    });
  });

  it("debe llamar next() si el service lanza un error", async () => {
    const error = new Error("DB error");
    createCommentService.mockRejectedValue(error);

    await createComment({ body: {} }, mockRes(), mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

// -------------------------
// updateComment
// -------------------------
describe("updateComment", () => {
  it("debe responder con el comment actualizado", async () => {
    const fakeComment = { id: 1, content: "Actualizado" };
    updateCommentService.mockResolvedValue(fakeComment);

    const req = { params: { id: "1" }, body: { content: "Actualizado" } };
    const res = mockRes();

    await updateComment(req, res, mockNext);

    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Comentario Actualizado con Exito",
      updated: fakeComment,
    });
  });

  it("debe llamar next() si el service lanza un error", async () => {
    const error = new Error("DB error");
    updateCommentService.mockRejectedValue(error);

    await updateComment({ params: { id: "1" }, body: {} }, mockRes(), mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

// -------------------------
// deleteComment
// -------------------------
describe("deleteComment", () => {
  it("debe responder con mensaje de éxito al eliminar", async () => {
    deleteCommentService.mockResolvedValue(1);

    const req = { params: { id: "1" } };
    const res = mockRes();

    await deleteComment(req, res, mockNext);

    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Comentario eliminado existosamente",
    });
  });

  it("debe llamar next() si el service lanza un error", async () => {
    const error = new Error("DB error");
    deleteCommentService.mockRejectedValue(error);

    await deleteComment({ params: { id: "1" } }, mockRes(), mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
