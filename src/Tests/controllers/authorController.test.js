// src/Tests/controllers/authorController.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../../Controllers/authorControllers.js";

// Mockea los services
vi.mock("../../Services/autorServices.js", () => ({
  getAllAuthorsService: vi.fn(),
  createAuthorService: vi.fn(),
  updateAuthorService: vi.fn(),
  deleteauthorService: vi.fn(),
}));

import {
  getAllAuthorsService,
  createAuthorService,
  updateAuthorService,
  deleteauthorService,
} from "../../Services/autorServices.js";

// Mocks reutilizables de req, res, next
const mockRes = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
});
const mockNext = vi.fn();

beforeEach(() => vi.clearAllMocks());

// -------------------------
// getAuthors
// -------------------------
describe("getAuthors", () => {
  it("debe responder con la lista de autores", async () => {
    const fakeAuthors = [
      { id: 1, name: "Juan" },
      { id: 2, name: "Ana" },
    ];
    getAllAuthorsService.mockResolvedValue(fakeAuthors);

    const res = mockRes();
    await getAuthors({}, res);

    expect(res.json).toHaveBeenCalledWith(fakeAuthors);
  });

  it("debe responder 500 si el service lanza un error", async () => {
    getAllAuthorsService.mockRejectedValue(new Error("DB error"));

    const res = mockRes();
    await getAuthors({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error al obtener autores",
    });
  });
});

// -------------------------
// getAuthorById
// -------------------------
describe("getAuthorById", () => {
  it("debe responder con el autor de req.author", async () => {
    const fakeAuthor = { id: 1, name: "Juan" };
    const req = { author: fakeAuthor }; // viene del middleware
    const res = mockRes();

    await getAuthorById(req, res, mockNext);

    expect(res.json).toHaveBeenCalledWith(fakeAuthor);
  });

  it("debe llamar next() si ocurre un error", async () => {
    const error = new Error("Error inesperado");
    const req = {
      get author() {
        throw error;
      }, // simula un error al acceder a req.author
    };
    const res = mockRes();

    await getAuthorById(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

// -------------------------
// createAuthor
// -------------------------
describe("createAuthor", () => {
  it("debe responder 201 con el autor creado", async () => {
    const body = { name: "Juan", email: "juan@mail.com", bio: "Escritor" };
    const fakeAuthor = { id: 1, ...body };
    createAuthorService.mockResolvedValue(fakeAuthor);

    const req = { body };
    const res = mockRes();

    await createAuthor(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Autor Creado con exito",
      newAuthor: fakeAuthor,
    });
  });

  it("debe llamar next() si el service lanza un error", async () => {
    const error = new Error("DB error");
    createAuthorService.mockRejectedValue(error);

    await createAuthor({ body: {} }, mockRes(), mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

// -------------------------
// updateAuthor
// -------------------------
describe("updateAuthor", () => {
  it("debe responder con el autor actualizado", async () => {
    const body = {
      name: "Juan Updated",
      email: "juan@mail.com",
      bio: "Editor",
    };
    const fakeAuthor = { id: 1, ...body };
    updateAuthorService.mockResolvedValue(fakeAuthor);

    const req = { params: { id: "1" }, body };
    const res = mockRes();

    await updateAuthor(req, res, mockNext);

    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Autor Actualizado con Exito",
      updated: fakeAuthor,
    });
  });

  it("debe llamar next() si el service lanza un error", async () => {
    const error = new Error("DB error");
    updateAuthorService.mockRejectedValue(error);

    await updateAuthor({ params: { id: "1" }, body: {} }, mockRes(), mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

// -------------------------
// deleteAuthor
// -------------------------
describe("deleteAuthor", () => {
  it("debe responder con mensaje de éxito al eliminar", async () => {
    deleteauthorService.mockResolvedValue(1);

    const req = { params: { id: "1" } };
    const res = mockRes();

    await deleteAuthor(req, res, mockNext);

    expect(res.json).toHaveBeenCalledWith({
      mensaje: "autor eliminado existosamente",
    });
  });

  it("debe llamar next() si el service lanza un error", async () => {
    const error = new Error("DB error");
    deleteauthorService.mockRejectedValue(error);

    await deleteAuthor({ params: { id: "1" } }, mockRes(), mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
