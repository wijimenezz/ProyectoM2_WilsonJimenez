// src/Tests/middlewares/postsMiddlewares.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  validatePost,
  validateDataPost,
  validatePostsByAuthorId,
} from "../../Middlewares/postsMiddlewares.js";

vi.mock("../../Services/postsServices.js", () => ({
  getPostByIdService: vi.fn(),
}));

import { getPostByIdService } from "../../Services/postsServices.js";

const mockRes = () => ({ status: vi.fn().mockReturnThis(), json: vi.fn() });
const mockNext = vi.fn();

beforeEach(() => vi.clearAllMocks());

// -------------------------
// validatePost
// -------------------------
describe("validatePost", () => {
  it("debe asignar req.post y llamar next() si el post existe", async () => {
    const fakePost = { id: 1, title: "Post 1" };
    getPostByIdService.mockResolvedValue(fakePost);

    const req = { params: { id: "1" } };
    const res = mockRes();

    await validatePost(req, res, mockNext);

    expect(req.post).toEqual(fakePost);
    expect(mockNext).toHaveBeenCalled();
  });

  it("debe responder 404 si el post no existe", async () => {
    getPostByIdService.mockResolvedValue(undefined);

    const req = { params: { id: "999" } };
    const res = mockRes();

    await validatePost(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Post no encontrado" });
    expect(mockNext).not.toHaveBeenCalled();
  });
});

// -------------------------
// validateDataPost
// -------------------------
describe("validateDataPost", () => {
  it("debe llamar next() si los datos son válidos", () => {
    const req = {
      body: {
        title: "Titulo válido",
        content: "Contenido suficientemente largo",
        author_id: 1,
      },
    };
    const res = mockRes();

    validateDataPost(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("debe retornar 400 si el titulo es muy corto", () => {
    const req = {
      body: {
        title: "Ti",
        content: "Contenido suficientemente largo",
        author_id: 1,
      },
    };
    const res = mockRes();

    validateDataPost(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "El Titulo es obligatorio y debe tener al menos 3 caracteres",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("debe retornar 400 si el content es muy corto", () => {
    const req = {
      body: { title: "Titulo válido", content: "Corto", author_id: 1 },
    };
    const res = mockRes();

    validateDataPost(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "El contenido del Post debe tener al menos 10 caracteres",
    });
  });

  it("debe retornar 400 si el author_id no es un número", () => {
    const req = {
      body: {
        title: "Titulo válido",
        content: "Contenido suficientemente largo",
        author_id: "abc",
      },
    };
    const res = mockRes();

    validateDataPost(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "author_id debe ser un número válido",
    });
  });
});

// -------------------------
// validatePostsByAuthorId
// -------------------------
describe("validatePostsByAuthorId", () => {
  it("debe llamar next() si el id es válido", () => {
    const req = { params: { id: "3" } };
    const res = mockRes();

    validatePostsByAuthorId(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("debe retornar 400 si el id no es un número", () => {
    const req = { params: { id: "abc" } };
    const res = mockRes();

    validatePostsByAuthorId(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
