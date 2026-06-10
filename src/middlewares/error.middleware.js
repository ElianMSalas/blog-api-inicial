const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      field: e.path[0],
      message: e.message,
    }));

    return res.status(400).json({
      status: "error",
      message: "Datos inválidos",
      errors,
    });
  }

  req.body = result.data;
  next();
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Error interno del servidor";

  // ─── Error de ID inválido de MongoDB ────────────────────────────────────────
  if (err.name === "CastError") {
    statusCode = 400;
    message = `ID inválido: ${err.value}`;
  }

  // ─── Error de campo único duplicado (ej: email ya registrado) ───────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = 409;
    message = `El ${field} ya está en uso`;
  }

  // ─── Error de validación de Mongoose ────────────────────────────────────────
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // ─── Token JWT inválido ──────────────────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Token inválido";
  }

  // ─── Token JWT expirado ──────────────────────────────────────────────────────
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Tu sesión ha expirado, vuelve a iniciar sesión";
  }

  // En desarrollo mostramos el stack trace, en producción no
  const response = {
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

module.exports = { validate, errorHandler };