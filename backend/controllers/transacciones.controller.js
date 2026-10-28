const { oracledb, conConexion, errorServidor } = require("../utils/db");

async function obtenerTransacciones(req, res) {
    try {
        const rows = await conConexion(async cn => {
            const r = await cn.execute(
                `SELECT tr.*, tt.nombre_tptran_tarjeta, t.numrun
                   FROM TRANSACCION_TARJETA_CLIENTE tr
                   JOIN TIPO_TRANSACCION_TARJETA tt
                     ON tt.cod_tptran_tarjeta = tr.cod_tptran_tarjeta
                   JOIN TARJETA_CLIENTE t ON t.nro_tarjeta = tr.nro_tarjeta
                  ORDER BY tr.fecha_transaccion DESC
                  FETCH FIRST 200 ROWS ONLY`,
                [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return r.rows;
        });
        res.json(rows);
    } catch (e) { errorServidor(res, e, "No se pudieron consultar las transacciones"); }
}

async function obtenerTransaccionPorId(req, res) {
    try {
        const rows = await conConexion(async cn => {
            const r = await cn.execute(
                `SELECT tr.*, tt.nombre_tptran_tarjeta, t.numrun
                   FROM TRANSACCION_TARJETA_CLIENTE tr
                   JOIN TIPO_TRANSACCION_TARJETA tt ON tt.cod_tptran_tarjeta = tr.cod_tptran_tarjeta
                   JOIN TARJETA_CLIENTE t ON t.nro_tarjeta = tr.nro_tarjeta
                  WHERE tr.nro_tarjeta = :nro_tarjeta
                    AND tr.nro_transaccion = :nro_transaccion`,
                { nro_tarjeta: req.params.nroTarjeta, nro_transaccion: req.params.nroTransaccion },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return r.rows;
        });
        if (!rows.length) return res.status(404).json({ error: "Transacción no encontrada" });
        res.json(rows[0]);
    } catch (e) { errorServidor(res, e, "No se pudo consultar la transacción"); }
}

async function obtenerTransaccionesPorCliente(req, res) {
    try {
        const rows = await conConexion(async cn => {
            const r = await cn.execute(
                `SELECT tr.*, tt.nombre_tptran_tarjeta, t.numrun
                   FROM TRANSACCION_TARJETA_CLIENTE tr
                   JOIN TIPO_TRANSACCION_TARJETA tt ON tt.cod_tptran_tarjeta = tr.cod_tptran_tarjeta
                   JOIN TARJETA_CLIENTE t ON t.nro_tarjeta = tr.nro_tarjeta
                  WHERE t.numrun = :numrun
                  ORDER BY tr.fecha_transaccion DESC`,
                { numrun: req.params.idCliente },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return r.rows;
        });
        res.json(rows);
    } catch (e) { errorServidor(res, e, "No se pudieron consultar las transacciones del cliente"); }
}

async function registrarTransaccion(req, res) {
    const b = req.body;
    const required = ["nro_tarjeta", "nro_transaccion", "fecha_transaccion", "monto_transaccion",
        "total_cuotas_transaccion", "monto_total_transaccion", "cod_tptran_tarjeta", "id_sucursal"];
    const missing = required.filter(k => b[k] === undefined || b[k] === null || b[k] === "");
    if (missing.length) return res.status(400).json({ error: "Faltan campos obligatorios", campos: missing });

    const cuotas = b.cuotas;
    if (!Array.isArray(cuotas) || cuotas.length !== Number(b.total_cuotas_transaccion)) {
        return res.status(400).json({
            error: "Debes enviar un arreglo cuotas cuya cantidad coincida con total_cuotas_transaccion"
        });
    }
    for (const [i, c] of cuotas.entries()) {
        if (!c.fecha_venc_cuota || c.valor_cuota === undefined || c.valor_cuota === null) {
            return res.status(400).json({ error: `La cuota ${i + 1} requiere fecha_venc_cuota y valor_cuota` });
        }
        if (Number(c.valor_cuota) <= 0) return res.status(400).json({ error: `El valor de la cuota ${i + 1} debe ser positivo` });
    }

    let cn;
    try {
        cn = await require("../config/database").obtenerConexion();
        await cn.execute(
            `INSERT INTO TRANSACCION_TARJETA_CLIENTE
             (nro_tarjeta, nro_transaccion, fecha_transaccion, monto_transaccion,
              total_cuotas_transaccion, monto_total_transaccion, cod_tptran_tarjeta, id_sucursal)
             VALUES (:nro_tarjeta, :nro_transaccion, TO_DATE(:fecha_transaccion, 'YYYY-MM-DD'),
                     :monto_transaccion, :total_cuotas_transaccion, :monto_total_transaccion,
                     :cod_tptran_tarjeta, :id_sucursal)`,
            {
                nro_tarjeta: b.nro_tarjeta, nro_transaccion: b.nro_transaccion,
                fecha_transaccion: b.fecha_transaccion, monto_transaccion: b.monto_transaccion,
                total_cuotas_transaccion: b.total_cuotas_transaccion,
                monto_total_transaccion: b.monto_total_transaccion,
                cod_tptran_tarjeta: b.cod_tptran_tarjeta, id_sucursal: b.id_sucursal
            }
        );

        for (let i = 0; i < cuotas.length; i++) {
            await cn.execute(
                `INSERT INTO CUOTA_TRANSAC_TARJETA_CLIENTE
                 (nro_tarjeta, nro_transaccion, nro_cuota, fecha_venc_cuota, valor_cuota)
                 VALUES (:nro_tarjeta, :nro_transaccion, :nro_cuota,
                         TO_DATE(:fecha_venc_cuota, 'YYYY-MM-DD'), :valor_cuota)`,
                {
                    nro_tarjeta: b.nro_tarjeta, nro_transaccion: b.nro_transaccion,
                    nro_cuota: cuotas[i].nro_cuota ?? i + 1,
                    fecha_venc_cuota: cuotas[i].fecha_venc_cuota,
                    valor_cuota: cuotas[i].valor_cuota
                }
            );
        }
        await cn.commit();
        res.status(201).json({
            mensaje: "Transacción y cuotas registradas",
            nota: "Este endpoint no ejecuta el bloque batch de cálculo de puntos, aportes y balance."
        });
    } catch (e) {
        if (cn) await cn.rollback();
        errorServidor(res, e, "No se pudo registrar la transacción y sus cuotas");
    } finally {
        if (cn) await cn.close();
    }
}

async function obtenerCuotas(req, res) {
    try {
        const rows = await conConexion(async cn => {
            const r = await cn.execute(
                `SELECT nro_tarjeta, nro_transaccion, nro_cuota,
                        fecha_venc_cuota, valor_cuota, fecha_pago, monto_pagado
                   FROM CUOTA_TRANSAC_TARJETA_CLIENTE
                  WHERE nro_tarjeta = :nro_tarjeta
                    AND nro_transaccion = :nro_transaccion
                  ORDER BY nro_cuota`,
                { nro_tarjeta: req.params.nroTarjeta, nro_transaccion: req.params.nroTransaccion },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return r.rows;
        });
        res.json(rows);
    } catch (e) { errorServidor(res, e, "No se pudieron consultar las cuotas"); }
}

async function registrarPagoCuota(req, res) {
    const { monto_pagado } = req.body;
    if (monto_pagado === undefined || monto_pagado === null || !Number.isFinite(Number(monto_pagado)) || Number(monto_pagado) <= 0) {
        return res.status(400).json({ error: "monto_pagado debe ser un número mayor que cero" });
    }

    try {
        const result = await conConexion(cn => cn.execute(
            `UPDATE CUOTA_TRANSAC_TARJETA_CLIENTE
                SET fecha_pago = SYSDATE, monto_pagado = :monto_pagado
              WHERE nro_tarjeta = :nro_tarjeta
                AND nro_transaccion = :nro_transaccion
                AND nro_cuota = :nro_cuota
                AND NVL(monto_pagado, 0) < valor_cuota`,
            {
                monto_pagado: Number(monto_pagado),
                nro_tarjeta: req.params.nroTarjeta,
                nro_transaccion: req.params.nroTransaccion,
                nro_cuota: req.params.nroCuota
            },
            { autoCommit: true }
        ));
        if (!result.rowsAffected) return res.status(404).json({ error: "Cuota no encontrada o ya pagada completamente" });
        res.json({ mensaje: "Pago registrado correctamente" });
    } catch (e) { errorServidor(res, e, "No se pudo registrar el pago de la cuota"); }
}

module.exports = {
    obtenerTransacciones, obtenerTransaccionPorId, obtenerTransaccionesPorCliente,
    registrarTransaccion, obtenerCuotas, registrarPagoCuota
};
