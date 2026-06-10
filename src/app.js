const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

// Middlewares globales
app.use(helmet());
app.use(cors());

// Limitar peticiones generales
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Ventana de 15 minutos
    max: 100,
    message: {
        status: "error",
        message: "Demasiadas peticiones desde esta IP, intenta más tarde",
    },
});

// Limitar peticiones de auth especificamente (más estricto)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        status: "error",
        message: "Demasiados intentos, intenta más tarde",
    },
});

app.use(morgan("dev"));
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "API funcionando correctamente"
    });
});

// Rutas
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/posts", require("./routes/post.routes"));
app.use("/api", require("./routes/comment.routes"));

// Ruta no encontrada (debe ir antes del errorHandler y después de todas las rutas)
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `La ruta ${req.method} ${req.originalUrl} no existe en esta API`,
  });
});

// Middleware glboal de errores
app.use(errorHandler)

module.exports = app;