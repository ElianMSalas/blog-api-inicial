const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "El nombre es obligatorio"],
            trim: true,
            minlength: [2, "El nombre debe tener al menos 2 caracteres"],
            maxlength: [50, "El nombre no puede superar 50 caracteres"],
        },
        email: {
            type: String,
            required: [true, "El email es obligatorio"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\S+@\S+\.\S+$/,
                "El email no tiene un formato válido",  
            ],
        },
        password: {
            type: String,
            required: [true, "La contraseña es obligatoria"],
            minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
            select: false,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

// Middleware de Mongoose: se ejecuta Antes de guardar
userSchema.pre("save", async function () {
    // Solo hashea si la contraseña fue modificada
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 12);
});

// Metodo del modelo: compara contraseña ingresada con la hasheada
userSchema.methods.comparePassword = async function (candidadatePassword) {
    return await bcrypt.compare(candidadatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;