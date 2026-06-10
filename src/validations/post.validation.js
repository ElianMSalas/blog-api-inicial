const { z } = require("zod");

const createPostSchema = z.object({
  title: z
    .string({ required_error: "El título es obligatorio" })
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(150, "El título no puede superar 150 caracteres"),

  content: z
    .string({ required_error: "El contenido es obligatorio" })
    .min(10, "El contenido debe tener al menos 10 caracteres"),

  excerpt: z.string().max(300).optional(),

  status: z.enum(["draft", "published"]).default("draft"),

  tags: z.array(z.string()).optional().default([]),

  coverImage: z.string().url("La URL de la imagen no es válida").optional(),
});

const updatePostSchema = createPostSchema.partial(); // Todos los campos opcionales

module.exports = { createPostSchema, updatePostSchema };