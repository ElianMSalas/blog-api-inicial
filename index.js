require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
        console.log(`Ambiente: ${process.env.NODE_ENV}`);
    });
};

startServer();

// Errores no capturados: evitan que el servidor se caiga silenciosamente
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err.message);
    process.exit(1);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err.message);
    process.exit(1);
});