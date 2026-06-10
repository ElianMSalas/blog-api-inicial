const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Genera un JWT con el id del usuario
const generateToken = (userId) => {
    return jwt.sign(
        {id: userId},
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// Registro
const register = async ({ name, email, password }) => {
    //Verificar si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error("El email ya está registrado");
        error.statusCode = 409; // Conflict
        throw error;
    }

    // Crear el usuario (el model se encarga de hashear la password)
    const user = await User.create({ name, email, password });

    // Generar token
    const token = generateToken(user._id);

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

// Login
const login = async ({ email, password }) => {
    // Buscar usuario por email (select("+password") porque tiene select:false)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        const error = new Error("Credenciales invalidas");
        error.statusCode = 401;
        throw error;
    }

    // Verificar contraseña
    const isCorrect = await user.comparePassword(password);
    if (!isCorrect) {
        const error = new Error("Credenciales invalidas");
        error.statusCode = 401;
        throw error;
    }

    // Generar token
    const token = generateToken(user._id);

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

module.exports = { register, login };
