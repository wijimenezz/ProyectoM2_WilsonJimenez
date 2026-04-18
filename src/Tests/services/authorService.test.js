import { describe, it, expect } from "vitest";

describe("setup test", () => {
  it("vitest funciona correctamente", () => {
    expect(1 + 1).toBe(2);
  });
});
// src/Tests/services/authorService.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllAuthorsService,
  getAuthorByIdService,
  createAuthorService,
  updateAuthorService,
  deleteauthorService,
} from "../../services/autorServices.js";

// Mockea el pool
vi.mock("../../db.js", () => ({
  pool: {
    query: vi.fn(),
  },
}));

// Importa el pool mockeado para controlarlo en los tests
import { pool } from "../../db.js";

// -------------------------
// getAllAuthorsService
// -------------------------
describe("getAllAuthorsService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("debe retornar todos los autores", async () => {
    const fakeAuthors = [
      { id: 1, name: "Juan", email: "juan@mail.com", bio: "Escritor" },
      { id: 2, name: "Ana", email: "ana@mail.com", bio: "Poetisa" },
    ];
    pool.query.mockResolvedValue({ rows: fakeAuthors });

    const result = await getAllAuthorsService();

    expect(result).toEqual(fakeAuthors);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  it("debe retornar un array vacío si no hay autores", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await getAllAuthorsService();

    expect(result).toEqual([]);
  });
});

// -------------------------
// getAuthorByIdService
// -------------------------
describe("getAuthorByIdService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("debe retornar un autor por id", async () => {
    const fakeAuthor = {
      id: 1,
      name: "Juan",
      email: "juan@mail.com",
      bio: "Escritor",
    };
    pool.query.mockResolvedValue({ rows: [fakeAuthor] });

    const result = await getAuthorByIdService(1);

    expect(result).toEqual(fakeAuthor);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM authors WHERE id= $1",
      [1],
    );
  });

  it("debe retornar undefined si el autor no existe", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await getAuthorByIdService(999);

    expect(result).toBeUndefined();
  });
});

// -------------------------
// createAuthorService
// -------------------------
describe("createAuthorService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("debe crear un autor y retornarlo", async () => {
    const datos = { name: "Juan", email: "juan@mail.com", bio: "Escritor" };
    const fakeAuthor = { id: 1, ...datos };
    pool.query.mockResolvedValue({ rows: [fakeAuthor] });

    const result = await createAuthorService(datos);

    expect(result).toEqual(fakeAuthor);
    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO authors (name, email, bio) VALUES ($1,$2,$3) RETURNING *",
      [datos.name, datos.email, datos.bio],
    );
  });
});

// -------------------------
// updateAuthorService
// -------------------------
describe("updateAuthorService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("debe actualizar un autor y retornarlo", async () => {
    const datos = {
      name: "Juan Updated",
      email: "juan@mail.com",
      bio: "Editor",
    };
    const fakeAuthor = { id: 1, ...datos };
    pool.query.mockResolvedValue({ rows: [fakeAuthor] });

    const result = await updateAuthorService(1, datos);

    expect(result).toEqual(fakeAuthor);
    expect(pool.query).toHaveBeenCalledWith(
      "UPDATE authors SET name = $1, email = $2, bio = $3 WHERE id = $4 RETURNING *",
      [datos.name, datos.email, datos.bio, 1],
    );
  });

  it("debe retornar undefined si el autor no existe", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await updateAuthorService(999, {});

    expect(result).toBeUndefined();
  });
});

// -------------------------
// deleteauthorService
// -------------------------
describe("deleteauthorService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("debe eliminar un autor y retornar rowCount 1", async () => {
    pool.query.mockResolvedValue({ rowCount: 1 });

    const result = await deleteauthorService(1);

    expect(result).toBe(1);
    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM authors WHERE id = $1",
      [1],
    );
  });

  it("debe retornar rowCount 0 si el autor no existe", async () => {
    pool.query.mockResolvedValue({ rowCount: 0 });

    const result = await deleteauthorService(999);

    expect(result).toBe(0);
  });
});
