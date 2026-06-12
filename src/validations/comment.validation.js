const { z } = require("zod");

const createCommentSchema = z.object({
    content: z
    .string({ required_error: "El contenido del comentario es obligatorio" })
    .trim()
    .min(2, "El comentario debe tener al menos 2 caracteres")
    .max(500, "El comentario no puede superar 500 caracteres"),
});

const updateCommentSchema = createCommentSchema;

module.exports = { createCommentSchema, updateCommentSchema };