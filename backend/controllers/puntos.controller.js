const { oracledb, conConexion, errorServidor } = require("../utils/db");

async function obtenerPuntos(req, res) {
    try {
        const rows = await conConexion(async cn => {
            const r = await cn.execute(
                `SELECT * FROM DETALLE_PUNTOS_TARJETA_CATB
                  ORDER BY fecha_transaccion DESC
                  FETCH FIRST 200 ROWS ONLY`,
                [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return r.rows;
        });
        res.json(rows);
    } catch (e) { errorServidor(res, e, "No se pudo consultar el detalle de puntos"); }
}

async function obtenerPuntosCliente(req, res) {
    try {
        const rows = await conConexion(async cn => {
            const r = await cn.execute(
                `SELECT * FROM DETALLE_PUNTOS_TARJETA_CATB
                  WHERE numrun = :numrun ORDER BY fecha_transaccion DESC`,
                { numrun: req.params.idCliente },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return r.rows;
        });
        res.json(rows);
    } catch (e) { errorServidor(res, e, "No se pudieron consultar los puntos del cliente"); }
}

async function obtenerPuntosVigentes(req, res) {
    try {
        const rows = await conConexion(async cn => {
            const r = await cn.execute(
                `SELECT * FROM PUNTOS_VIGENTES
                  WHERE numrun = :numrun
                  ORDER BY fecha_transaccion DESC`,
                { numrun: req.params.idCliente },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return r.rows;
        });
        res.json(rows);
    } catch (e) { errorServidor(res, e, "No se pudieron consultar los puntos vigentes"); }
}

async function obtenerResumenPuntos(req, res) {
    try {
        const rows = await conConexion(async cn => {
            const r = await cn.execute(
                `SELECT * FROM RESUMEN_PUNTOS_TARJETA_CATB
                  ORDER BY TO_DATE(mes_anno, 'MMYYYY') DESC`,
                [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return r.rows;
        });
        res.json(rows);
    } catch (e) { errorServidor(res, e, "No se pudo consultar el resumen mensual de puntos"); }
}

module.exports = { obtenerPuntos, obtenerPuntosCliente, obtenerPuntosVigentes, obtenerResumenPuntos };
