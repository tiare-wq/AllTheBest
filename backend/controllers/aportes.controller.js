const { oracledb, conConexion, errorServidor } = require("../utils/db");

async function obtenerTramos(req, res) {
    try {
        const rows = await conConexion(async cn => {
            const r = await cn.execute(
                `SELECT tramo_inf_av_sav, tramo_sup_av_sav, porc_aporte_sbif
                   FROM TRAMO_APORTE_SBIF ORDER BY tramo_inf_av_sav`,
                [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return r.rows;
        });
        res.json(rows);
    } catch (e) { errorServidor(res, e, "No se pudieron consultar los tramos SBIF"); }
}

async function obtenerAportesCliente(req, res) {
    try {
        const rows = await conConexion(async cn => {
            const r = await cn.execute(
                `SELECT * FROM DETALLE_APORTE_SBIF
                  WHERE numrun = :numrun ORDER BY fecha_transaccion DESC`,
                { numrun: req.params.idCliente },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return r.rows;
        });
        res.json(rows);
    } catch (e) { errorServidor(res, e, "No se pudieron consultar los aportes del cliente"); }
}

async function obtenerResumenAportes(req, res) {
    try {
        const rows = await conConexion(async cn => {
            const r = await cn.execute(
                `SELECT * FROM RESUMEN_APORTE_SBIF
                  ORDER BY TO_DATE(mes_anno, 'MMYYYY') DESC, tipo_transaccion`,
                [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return r.rows;
        });
        res.json(rows);
    } catch (e) { errorServidor(res, e, "No se pudo consultar el resumen mensual SBIF"); }
}

module.exports = { obtenerTramos, obtenerAportesCliente, obtenerResumenAportes };
