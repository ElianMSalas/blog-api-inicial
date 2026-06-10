const authService = require("../services/auth.service");

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json({
            status: "success",
            data: result,
        });
    } catch (error) {
        next(error); // Pasa el error al middleware global de errores
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        res.status(200).json({
            status: "success",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };