const Post = require("../models/post.model");

// ─── Obtener todos los posts publicados con paginación ────────────────────────
const getAllPosts = async (query) => {
  const { page = 1, limit = 10, tag, status = "published" } = query;
  const skip = (page - 1) * limit;

  const filter = { status };
  if (tag) filter.tags = tag; // Filtra por tag si se proporciona

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate("author", "name email")   // Trae nombre y email del autor
      .populate("commentCount")           // Trae el conteo de comentarios
      .sort({ createdAt: -1 })            // Más recientes primero
      .skip(skip)
      .limit(Number(limit)),
    Post.countDocuments(filter),
  ]);

  return {
    posts,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Obtener post por ID
const getPostById = async (id) => {
  const post = await Post.findById(id)
    .populate("author", "name email")
    .populate("commentCount");

  if (!post) {
    const error = new Error("Post no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return post;
};

// ─── Obtener un post por slug ─────────────────────────────────────────────────
const getPostBySlug = async (slug) => {
  const post = await Post.findOne({ slug })
    .populate("author", "name email")
    .populate("commentCount");

  if (!post) {
    const error = new Error("Post no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return post;
};

// ─── Crear un post ────────────────────────────────────────────────────────────
const createPost = async (data, authorId) => {
  const post = await Post.create({ ...data, author: authorId });
  return post;
};

// ─── Actualizar un post ───────────────────────────────────────────────────────
const updatePost = async (slug, data, userId) => {
  const post = await Post.findOne({ slug });

  if (!post) {
    const error = new Error("Post no encontrado");
    error.statusCode = 404;
    throw error;
  }

  // Verificar que el usuario es el autor
  if (post.author.toString() !== userId.toString()) {
    const error = new Error("No puedes editar un post que no es tuyo");
    error.statusCode = 403;
    throw error;
  }

  Object.assign(post, data); // Aplica los cambios
  await post.save();         // Dispara el pre("save") para actualizar slug
  return post;
};

// ─── Eliminar un post ─────────────────────────────────────────────────────────
const deletePost = async (slug, userId, userRole) => {
  const post = await Post.findOne({ slug });

  if (!post) {
    const error = new Error("Post no encontrado");
    error.statusCode = 404;
    throw error;
  }

  // El admin puede borrar cualquier post, el usuario solo el suyo
  if (post.author.toString() !== userId.toString() && userRole !== "admin") {
    const error = new Error("No puedes eliminar un post que no es tuyo");
    error.statusCode = 403;
    throw error;
  }

  await post.deleteOne();
  return null;
};

module.exports = { getAllPosts, getPostById, getPostBySlug, createPost, updatePost, deletePost };