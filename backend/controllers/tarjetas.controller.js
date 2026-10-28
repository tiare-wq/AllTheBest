const { oracledb, conConexion, errorServidor } = require("../utils/db");

async function obtenerTarjetas(req, res) {
    try {
        const rows = await conConexion(async cn => {
            const r = await cn.execute(
                `SELECT t.*, c.pnombre, c.snombre, c.appaterno, c.apmaterno, c.dvrun
                   FROM TARJETA_CLIENTE t
                   JOIN CLIENTE c ON c.numrun = t.numrun
                  ORDER BY t.nro_tarjeta
                  FETCH FIRST 200 ROWS ONLY`,
                [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return r.rows;
        });
        res.json(rows);
    } catch (e) { errorServidor(res, e, "No se pudieron consultar las tarjetas"); }
}

async function obtenerTarjetaPorId(req, res) {
    try {
        const rows = await conConexion(async cn => {
            const r = await cn.execute(
                `SELECT t.*, c.pnombre, c.snombre, c.appaterno, c.apmaterno, c.dvrun
                   FROM TARJETA_CLIENTE t
                   JOIN CLIENTE c ON c.numrun = t.numrun
                  WHERE t.nro_tarjeta = :nro_tarjeta`,
                { nro_tarjeta: req.params.id },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return r.rows;
        });
        if (!rows.length) return res.status(404).json({ error: "Tarjeta no encontrada" });
        res.json(rows[0]);
    } catch (e) { errorServidor(res, e, "No se pudo consultar la tarjeta"); }
}

async function obtenerTarjetasPorCliente(req, res) {
    try {
        const rows = await conConexion(async cn => {
            const r = await cn.execute(
                `SELECT * FROM TARJETA_CLIENTE WHERE numrun = :numrun ORDER BY nro_tarjeta`,
                { numrun: req.params.idCliente },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return r.rows;
        });
        res.json(rows);
    } catch (e) { errorServidor(res, e, "No se pudieron consultar las tarjetas del cliente"); }
}

async function registrarTarjeta(req, res) {
    const b = req.body;
    const required = ["nro_tarjeta", "numrun", "fecha_solic_tarjeta", "dia_pago_mensual",
        "cupo_compra", "cupo_super_avance", "cupo_disp_compra", "cupo_disp_sp_avance"];
    const missing = required.filter(k => b[k] === undefined || b[k] === null || b[k] === "");
    if (missing.length) return res.status(400).json({ error: "Faltan campos obligatorios", campos: missing });

    try {
        await conConexion(cn => cn.execute(
            `INSERT INTO TARJETA_CLIENTE
             (nro_tarjeta, numrun, fecha_solic_tarjeta, dia_pago_mensual,
              cupo_compra, cupo_super_avance, cupo_disp_compra, cupo_disp_sp_avance)
             VALUES (:nro_tarjeta, :numrun, TO_DATE(:fecha_solic_tarjeta, 'YYYY-MM-DD'),
                     :dia_pago_mensual, :cupo_compra, :cupo_super_avance,
                     :cupo_disp_compra, :cupo_disp_sp_avance)`,
            {
                nro_tarjeta: b.nro_tarjeta, numrun: b.numrun,
                fecha_solic_tarjeta: b.fecha_solic_tarjeta, dia_pago_mensual: b.dia_pago_mensual,
                cupo_compra: b.cupo_compra, cupo_super_avance: b.cupo_super_avance,
                cupo_disp_compra: b.cupo_disp_compra, cupo_disp_sp_avance: b.cupo_disp_sp_avance
            },
            { autoCommit: true }
        ));
        res.status(201).json({ mensaje: "Tarjeta registrada correctamente" });
    } catch (e) { errorServidor(res, e, "No se pudo registrar la tarjeta"); }
}

module.exports = { obtenerTarjetas, obtenerTarjetaPorId, obtenerTarjetasPorCliente, registrarTarjeta };
