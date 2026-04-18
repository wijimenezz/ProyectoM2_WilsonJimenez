// src/Tests/middlewares/globalMiddlewares.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  errorHandler,
  validateId,
} from "../../Middlewares/globalMiddleware.js";

const mockRes = () => ({ status: vi.fn().mockReturnThis(), json: vi.fn() });
const mockNext = vi.fn();

beforeEach(() => vi.clearAllMocks());

// -------------------------
// validateId
// -------------------------
describe("validateId", () => {
  it("debe llamar next() si el id es válido", () => {
    const req = { params: { id: "5" } };
    const res = mockRes();

    validateId(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("debe retornar 400 si no viene el id", () => {
    const req = { params: {} };
    const res = mockRes();

    validateId(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Debe enviar un id" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("debe retornar 400 si el id no es un número entero", () => {
    const req = { params: { id: "abc" } };
    const res = mockRes();

    validateId(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "ID inválido, debe ser un número entero",
    });
  });
});

// -------------------------
// errorHandler
// -------------------------
describe("errorHandler", () => {
  it("debe responder 400 si el error es de dato duplicado (23505)", () => {
    const err = { code: "23505" };
    const res = mockRes();

    errorHandler(err, {}, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Dato duplicado" });
  });

  it("debe responder con el status del error si tiene uno definido", () => {
    const err = { status: 403, message: "No autorizado" };
    const res = mockRes();

    errorHandler(err, {}, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "No autorizado" });
  });

  it("debe responder 500 si el error no tiene status", () => {
    const err = new Error("Error inesperado");
    const res = mockRes();

    errorHandler(err, {}, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Error inesperado" });
  });
});
