const { oracledb, conConexion, errorServidor } = require("../utils/db");

// GET: obtener todos los detalles de puntos
async function obtenerDetalles(req, res) {
    try {
        const detalles = await conConexion(async (conexion) => {
            const resultado = await conexion.execute(
                `SELECT
                    numrun,
                    dvrun,
                    nro_tarjeta,
                    nro_transaccion,
                    fecha_transaccion,
                    tipo_transaccion,
                    monto_transaccion,
                    puntos_allthebest
                 FROM DETALLE_PUNTOS_TARJETA_CATB
                 ORDER BY fecha_transaccion DESC`,
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );

            return resultado.rows;
        });

        return res.status(200).json(detalles);
    } catch (error) {
        return errorServidor(res, error, "Error al obtener los detalles de puntos");
    }
}

// GET: obtener el detalle de puntos de una tarjeta
async function obtenerDetalleTarjeta(req, res) {
    const { nroTarjeta } = req.params;

    try {
        const detalles = await conConexion(async (conexion) => {
            const resultado = await conexion.execute(
                `SELECT
                    numrun,
                    dvrun,
                    nro_tarjeta,
                    nro_transaccion,
                    fecha_transaccion,
                    tipo_transaccion,
                    monto_transaccion,
                    puntos_allthebest
                 FROM DETALLE_PUNTOS_TARJETA_CATB
                 WHERE nro_tarjeta = :nroTarjeta
                 ORDER BY fecha_transaccion DESC`,
                { nroTarjeta },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );

            return resultado.rows;
        });

        return res.status(200).json(detalles);
    } catch (error) {
        return errorServidor(res, error, "Error al obtener el detalle de la tarjeta");
    }
}

// GET: obtener el detalle de puntos de un cliente
async function obtenerDetallePorCliente(req, res) {
    const { numrun } = req.params;

    try {
        const detalles = await conConexion(async (conexion) => {
            const resultado = await conexion.execute(
                `SELECT
                    numrun,
                    dvrun,
                    nro_tarjeta,
                    nro_transaccion,
                    fecha_transaccion,
                    tipo_transaccion,
                    monto_transaccion,
                    puntos_allthebest
                 FROM DETALLE_PUNTOS_TARJETA_CATB
                 WHERE numrun = :numrun
                 ORDER BY fecha_transaccion DESC`,
                { numrun },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );

            return resultado.rows;
        });

        return res.status(200).json(detalles);
    } catch (error) {
        return errorServidor(res, error, "Error al obtener el detalle de puntos del cliente");
    }
}

async function obtenerDetalleAporteSbif(req, res) {
    const { nroTarjeta } = req.params;

    try {
        const resultado = await conConexion(async (conexion) => {
            return await conexion.execute(
                `SELECT
                    numrun,
                    dvrun,
                    nro_tarjeta,
                    nro_transaccion,
                    fecha_transaccion,
                    tipo_transaccion,
                    monto_transaccion,
                    aporte_sbif
                FROM detalle_aporte_sbif
                WHERE nro_tarjeta = :nroTarjeta
                ORDER BY fecha_transaccion, nro_transaccion`,
                { nroTarjeta },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
        });

        return res.json(resultado.rows);
    } catch (error) {
        return errorServidor(
            res,
            error,
            "Error al obtener el detalle del aporte SBIF"
        );
    }
}

module.exports = {
    obtenerDetalles,
    obtenerDetalleTarjeta,
    obtenerDetallePorCliente,
    obtenerDetalleAporteSbif
};