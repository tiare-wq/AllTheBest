const oracledb = require("oracledb");
require("dotenv").config();

let pool;

async function conectarBD() {
    try {
        pool = await oracledb.createPool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING,

            poolMin: 1,
            poolMax: 5,
            poolIncrement: 1
        });

        console.log("Conexión con Oracle establecida");
    } catch (error) {
        console.error("Error conectando con Oracle:", error);
        throw error;
    }
}

async function obtenerConexion() {
    if (!pool) {
        throw new Error("El pool de Oracle no está inicializado");
    }

    return await pool.getConnection();
}

async function cerrarPool() {
    if (pool) {
        await pool.close(10);
        pool = undefined;
    }
}

module.exports = {
    conectarBD,
    obtenerConexion,
    cerrarPool
};