const oracledb = require("oracledb");
const { obtenerConexion } = require("../config/database");

async function conConexion(callback) {
    let conexion;

    try {
        conexion = await obtenerConexion();
        return await callback(conexion);
    } finally {
        if (conexion) {
            await conexion.close();
        }
    }
}

function errorServidor(res, error, mensaje = "Error interno del servidor") {
    console.error(mensaje, error);

    return res.status(500).json({
        error: mensaje
    });
}

module.exports = {
    oracledb,
    conConexion,
    errorServidor
};