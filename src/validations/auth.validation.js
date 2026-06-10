const { z } = require("zod");

const registerSchema = z.object({
    name: z
    .string({ required_error: "El nombre es obligatorio" })
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede superar 50 caracteres"),

    email: z
    .string({ required_error: "El email es obligatorio"})
    .email("El email no tiene un formato valido"),

    password: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const loginSchema = z.object({
    email: z
    .string({ required_error: "El email es obligatorio" })
    .email("El email no tiene un formato valido"),
    password: z
    .string({ required_error: "La contraseña es obligatoria" }),
});

module.exports = { registerSchema, loginSchema };