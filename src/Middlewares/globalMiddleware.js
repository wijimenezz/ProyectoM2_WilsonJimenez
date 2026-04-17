export const errorHandler = (err, req, res, next) => {
  console.error(err);
  
  if (err.code === "23505") {
    return res.status(400).json({
      mensaje: "Dato duplicado"
    });
  }

  
  const status = err.status || 500;

  res.status(status).json({
    mensaje: err.message || "Error interno del servidor",
  });
};

export const validateId = (req, res, next) => {
  const { id } = req.params;

   if (!id) {
    return res.status(400).json({
      mensaje: "Debe enviar un id"
    });
  }

  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({
      error: "ID inválido, debe ser un número entero",
    });
  }

  next();
};