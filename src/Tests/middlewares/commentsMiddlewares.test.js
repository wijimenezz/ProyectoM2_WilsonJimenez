// src/Tests/middlewares/commentsMiddlewares.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  validateComments,
  validateDataComment,
  validateCommentByAuthorPostId,
} from "../../Middlewares/commentsMiddlewares.js";

vi.mock("../../Services/commentsServices.js", () => ({
  getCommentsByIdService: vi.fn(),
}));

import { getCommentsByIdService } from "../../Services/commentsServices.js";

const mockRes = () => ({ status: vi.fn().mockReturnThis(), json: vi.fn() });
const mockNext = vi.fn();

beforeEach(() => vi.clearAllMocks());

// -------------------------
// validateComments
// -------------------------
describe("validateComments", () => {
  it("debe asignar req.comment y llamar next() si el comment existe", async () => {
    const fakeComment = { id: 1, content: "Hola mundo" };
    getCommentsByIdService.mockResolvedValue(fakeComment);

    const req = { params: { id: "1" } };
    const res = mockRes();

    await validateComments(req, res, mockNext);

    expect(req.comment).toEqual(fakeComment);
    expect(mockNext).toHaveBeenCalled();
  });

  it("debe responder 404 si el comment no existe", async () => {
    getCommentsByIdService.mockResolvedValue(undefined);

    const req = { params: { id: "999" } };
    const res = mockRes();

    await validateComments(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Comentario no encontrado",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});

// -------------------------
// validateDataComment
// -------------------------
describe("validateDataComment", () => {
  it("debe llamar next() si el content es válido", () => {
    const req = { body: { content: "Este es un comentario válido" } };
    const res = mockRes();

    validateDataComment(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("debe retornar 400 si el content es muy corto", () => {
    const req = { body: { content: "Hol" } };
    const res = mockRes();

    validateDataComment(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("debe retornar 400 si el content está vacío", () => {
    const req = { body: {} };
    const res = mockRes();

    validateDataComment(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });
});

// -------------------------
// validateCommentByAuthorPostId
// -------------------------
describe("validateCommentByAuthorPostId", () => {
  it("debe llamar next() si el id es válido", () => {
    const req = { params: { id: "5" } };
    const res = mockRes();

    validateCommentByAuthorPostId(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("debe retornar 400 si el id no es un número", () => {
    const req = { params: { id: "abc" } };
    const res = mockRes();

    validateCommentByAuthorPostId(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("debe retornar 400 si el id no viene", () => {
    const req = { params: {} };
    const res = mockRes();

    validateCommentByAuthorPostId(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
