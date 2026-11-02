const { oracledb, conConexion, errorServidor } = require("../utils/db");

async function obtenerBalanceAnual(req, res) {
    try {
        const rows = await conConexion(async cn => {
            const r = await cn.execute(
                `SELECT * FROM BALANCE_ANUAL_DETALLE_TRANSAC
                  ORDER BY TO_DATE(SUBSTR(mes_anno, 1, 6), 'MMYYYY') DESC,
                           fecha_transaccion DESC
                  FETCH FIRST 500 ROWS ONLY`,
                [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return r.rows;
        });
        res.json(rows);
    } catch (e) { errorServidor(res, e, "No se pudo consultar el balance anual"); }
}

async function obtenerBalancePorAnio(req, res) {
    const anio = String(req.params.anio);
    if (!/^\\d{4}$/.test(anio)) return res.status(400).json({ error: "El año debe tener cuatro dígitos" });
    try {
        const rows = await conConexion(async cn => {
            const r = await cn.execute(
                `SELECT * FROM BALANCE_ANUAL_DETALLE_TRANSAC
                  WHERE SUBSTR(mes_anno, 3, 4) = :anio
                  ORDER BY fecha_transaccion DESC, nro_tarjeta, nro_transaccion`,
                { anio },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return r.rows;
        });
        res.json(rows);
    } catch (e) { errorServidor(res, e, "No se pudo consultar el balance del año indicado"); }
}

async function obtenerTransaccionesPorTipo(req, res) {
    try {
        const resultado = await conConexion(async (conexion) => {
            return await conexion.execute(
                `SELECT
                    t.nombre_tptran_tarjeta AS tipo_transaccion,
                    COUNT(*) AS cantidad
                 FROM transaccion_tarjeta_cliente tc
                 INNER JOIN tipo_transaccion_tarjeta t
                    ON tc.cod_tptran_tarjeta = t.cod_tptran_tarjeta
                 GROUP BY t.nombre_tptran_tarjeta
                 ORDER BY cantidad DESC`,
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
        });

        return res.json(resultado.rows);
    } catch (error) {
        return errorServidor(
            res,
            error,
            "Error al obtener las transacciones por tipo"
        );
    }
}
module.exports = { obtenerBalanceAnual, obtenerBalancePorAnio,
    obtenerTransaccionesPorTipo
 };