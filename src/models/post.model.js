const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      minlength: [5, "El título debe tener al menos 5 caracteres"],
      maxlength: [150, "El título no puede superar 150 caracteres"],
    },
    slug: {
      type: String,
      unique: true,      // URL amigable única: "mi-primer-post"
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "El contenido es obligatorio"],
      minlength: [10, "El contenido debe tener al menos 10 caracteres"],
    },
    excerpt: {
      type: String,
      maxlength: [300, "El resumen no puede superar 300 caracteres"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",       // Referencia al modelo User
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    tags: [String],      // Array de strings: ["javascript", "node"]
    coverImage: {
      type: String,      // URL de la imagen
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },   // Incluye campos virtuales al convertir a JSON
  }
);

// ─── Virtual: cuenta de comentarios (se calculan, no se guardan) ──────────────
postSchema.virtual("commentCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  count: true,
});

// ─── Genera el slug automáticamente desde el título ───────────────────────────
postSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")   // Elimina caracteres especiales
      .replace(/\s+/g, "-")       // Espacios → guiones
      .replace(/-+/g, "-");       // Múltiples guiones → uno solo
  }

  // Genera excerpt automáticamente si no se proporcionó
  if (this.isModified("content") && !this.excerpt) {
    this.excerpt = this.content.substring(0, 200) + "...";
  }
;
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;