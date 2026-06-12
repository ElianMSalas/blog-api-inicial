const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { protect } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/error.middleware");
const { createCommentSchema, updateCommentSchema } = require("../validations/comment.validation");

// Obtener comentarios de un post (público)
router.get("/posts/:postId/comments", commentController.getCommentsByPost);

// Crear comentario en un post (protegido)
router.post("/posts/:postId/comments", protect, validate(createCommentSchema), commentController.createComment);

// Editar y eliminar comentario (protegido)
router.patch("/comments/:commentId", protect, validate(updateCommentSchema), commentController.updateComment);
router.delete("/comments/:commentId", protect, commentController.deleteComment);

module.exports = router;