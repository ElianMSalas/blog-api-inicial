const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { protect } = require("../middlewares/auth.middleware");

// Obtener comentarios de un post (público)
router.get("/posts/:postId/comments", commentController.getCommentsByPost);

// Crear comentario en un post (protegido)
router.post("/posts/:postId/comments", protect, commentController.createComment);

// Editar y eliminar comentario (protegido)
router.patch("/comments/:commentId", protect, commentController.updateComment);
router.delete("/comments/:commentId", protect, commentController.deleteComment);

module.exports = router;