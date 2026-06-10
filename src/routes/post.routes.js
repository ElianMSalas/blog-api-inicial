const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const { protect } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/error.middleware");
const { createPostSchema, updatePostSchema } = require("../validations/post.validation");

// Rutas públicas (no requieren token)
router.get("/", postController.getAllPosts);
router.get("/id/:id", postController.getPostById);
router.get("/:slug", postController.getPostBySlug);

// Rutas protegidas (requieren token)
router.post("/", protect, validate(createPostSchema), postController.createPost);
router.patch("/:slug", protect, validate(updatePostSchema), postController.updatePost);
router.delete("/:slug", protect, postController.deletePost);

module.exports = router;