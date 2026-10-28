const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { conectarBD, cerrarPool } = require("./config/database");

const clientesRoutes = require("./routes/clientes.routes");

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

// Ruta de prueba
app.get("/api/health", (req, res) => {
    res.json({
        mensaje: "Servidor All The Best funcionando"
    });
});

// Rutas de clientes
app.use("/api/clientes", clientesRoutes);

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        await conectarBD();

        app.listen(PORT, () => {
            console.log(`Servidor activo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("No se pudo iniciar el servidor:", error);
        process.exit(1);
    }
}

iniciarServidor();

process.on("SIGINT", async () => {
    await cerrarPool();
    process.exit(0);
});


// ----------------------------
// RUTAS
// ----------------------------

const rutas = require("./routes/index.routes");

// Middleware
app.use(express.json());

// Rutas de la API
app.use("/api", rutas);