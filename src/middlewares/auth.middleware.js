const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
    try {
        // Verificar que el header Authorization existe y tiene el formato correcto
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                status: "error",
                message: "No autorizado. Token no proporcionado",
            });
        }

        // Extraer el token del header
        const token = authHeader.split(" ")[1];

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verificar que el usuario todavía existe en la BD
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "El usuario ya no existe",
            });
        }

        // Adjuntar el usuario a req para que los controllers lo usen
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            status: "error",
            message: "Token invalido o expirado",
        });
    }
};

// Middleware para restringir por rol
const restrictTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({
            status: "error",
            message: "No tienes permiso para realizar esta acción",
        });
    }
    next();
};

module.exports = { protect, restrictTo };