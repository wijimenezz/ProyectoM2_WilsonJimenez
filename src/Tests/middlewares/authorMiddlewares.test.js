// src/Tests/middlewares/authorMiddlewares.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  validateAuthor,
  validateDataAuthor,
} from "../../Middlewares/authorMiddlewares.js";

vi.mock("../../Services/autorServices.js", () => ({
  getAuthorByIdService: vi.fn(),
}));

import { getAuthorByIdService } from "../../Services/autorServices.js";

const mockRes = () => ({ status: vi.fn().mockReturnThis(), json: vi.fn() });
const mockNext = vi.fn();

beforeEach(() => vi.clearAllMocks());

// -------------------------
// validateAuthor
// -------------------------
describe("validateAuthor", () => {
  it("debe asignar req.author y llamar next() si el autor existe", async () => {
    const fakeAuthor = { id: 1, name: "Juan" };
    getAuthorByIdService.mockResolvedValue(fakeAuthor);

    const req = { params: { id: "1" } };
    const res = mockRes();

    await validateAuthor(req, res, mockNext);

    expect(req.author).toEqual(fakeAuthor);
    expect(mockNext).toHaveBeenCalled();
  });

  it("debe responder 404 si el autor no existe", async () => {
    getAuthorByIdService.mockResolvedValue(undefined);

    const req = { params: { id: "999" } };
    const res = mockRes();

    await validateAuthor(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Autor no encontrado" });
    expect(mockNext).not.toHaveBeenCalled();
  });
});

// -------------------------
// validateDataAuthor
// -------------------------
describe("validateDataAuthor", () => {
  it("debe llamar next() si los datos son válidos", () => {
    const req = {
      body: {
        name: "Juan",
        email: "juan@mail.com",
        bio: "Escritor con experiencia",
      },
    };
    const res = mockRes();

    validateDataAuthor(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("debe retornar 400 si el nombre es muy corto", () => {
    const req = {
      body: {
        name: "Ju",
        email: "juan@mail.com",
        bio: "Escritor con experiencia",
      },
    };
    const res = mockRes();

    validateDataAuthor(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "El nombre es obligatorio y debe tener al menos 3 caracteres",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("debe retornar 400 si el email es inválido", () => {
    const req = {
      body: {
        name: "Juan",
        email: "emailinvalido",
        bio: "Escritor con experiencia",
      },
    };
    const res = mockRes();

    validateDataAuthor(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "El email no es válido" });
  });

  it("debe retornar 400 si la bio es muy corta", () => {
    const req = {
      body: { name: "Juan", email: "juan@mail.com", bio: "Corta" },
    };
    const res = mockRes();

    validateDataAuthor(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "La biografía debe tener al menos 10 caracteres",
    });
  });
});
