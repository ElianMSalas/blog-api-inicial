const Comment = require("../models/comment.model");
const Post = require("../models/post.model");

// ─── Obtener comentarios de un post ───────────────────────────────────────────
const getCommentsByPost = async (postId, query = {}) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;
  
  // Verificar que el post existe
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error("Post no encontrado");
    error.statusCode = 404;
    throw error;
  }

  const [comments, total] = await Promise.all([
    Comment.find({ post: postId })
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Comment.countDocuments({ post: postId }),
  ]);

  return {
    comments,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.cell(total / limit),
    },
  };
};

// ─── Crear un comentario ──────────────────────────────────────────────────────
const createComment = async (postId, content, authorId) => {
  // Verificar que el post existe y está publicado
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error("Post no encontrado");
    error.statusCode = 404;
    throw error;
  }

  if (post.status !== "published") {
    const error = new Error("No puedes comentar en un post no publicado");
    error.statusCode = 400;
    throw error;
  }

  const comment = await Comment.create({
    content,
    author: authorId,
    post: postId,
  });

  // Populate para devolver los datos del autor en la respuesta
  await comment.populate("author", "name email");

  return comment;
};

// ─── Actualizar un comentario ─────────────────────────────────────────────────
const updateComment = async (commentId, content, userId) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    const error = new Error("Comentario no encontrado");
    error.statusCode = 404;
    throw error;
  }

  // Solo el autor puede editar su comentario
  if (comment.author.toString() !== userId.toString()) {
    const error = new Error("No puedes editar un comentario que no es tuyo");
    error.statusCode = 403;
    throw error;
  }

  comment.content = content;
  await comment.save();
  await comment.populate("author", "name email");

  return comment;
};

// ─── Eliminar un comentario ───────────────────────────────────────────────────
const deleteComment = async (commentId, userId, userRole) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    const error = new Error("Comentario no encontrado");
    error.statusCode = 404;
    throw error;
  }

  // El admin puede borrar cualquier comentario, el usuario solo el suyo
  if (comment.author.toString() !== userId.toString() && userRole !== "admin") {
    const error = new Error("No puedes eliminar un comentario que no es tuyo");
    error.statusCode = 403;
    throw error;
  }

  await comment.deleteOne();
  return null;
};

module.exports = { getCommentsByPost, createComment, updateComment, deleteComment };