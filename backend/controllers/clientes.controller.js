const { oracledb, conConexion, errorServidor } = require("../utils/db");

async function obtenerClientes(req, res) {
    try {
        const rows = await conConexion(async cn => {
            const r = await cn.execute(
                `SELECT c.numrun, c.dvrun, c.pnombre, c.snombre,
                        c.appaterno, c.apmaterno, c.fecha_nacimiento,
                        c.fecha_inscripcion, c.correo, c.fono_contacto,
                        c.direccion, c.cod_region, rg.nombre_region,
                        c.cod_provincia, pr.nombre_provincia,
                        c.cod_comuna, co.nombre_comuna,
                        c.cod_prof_ofic, po.nombre_prof_ofic,
                        c.cod_tipo_cliente, tc.nombre_tipo_cliente
                   FROM CLIENTE c
                   JOIN COMUNA co
                     ON co.cod_region = c.cod_region
                    AND co.cod_provincia = c.cod_provincia
                    AND co.cod_comuna = c.cod_comuna
                   JOIN PROVINCIA pr
                     ON pr.cod_region = c.cod_region
                    AND pr.cod_provincia = c.cod_provincia
                   JOIN REGION rg ON rg.cod_region = c.cod_region
                   JOIN PROFESION_OFICIO po ON po.cod_prof_ofic = c.cod_prof_ofic
                   JOIN TIPO_CLIENTE tc ON tc.cod_tipo_cliente = c.cod_tipo_cliente
                  ORDER BY c.appaterno, c.pnombre
                  FETCH FIRST 200 ROWS ONLY`,
                [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return r.rows;
        });
        res.json(rows);
    } catch (e) { errorServidor(res, e, "No se pudieron consultar los clientes"); }
}

async function obtenerClientePorId(req, res) {
    try {
        const rows = await conConexion(async cn => {
            const r = await cn.execute(
                `SELECT * FROM CLIENTE WHERE numrun = :numrun`,
                { numrun: req.params.id },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return r.rows;
        });
        if (!rows.length) return res.status(404).json({ error: "Cliente no encontrado" });
        res.json(rows[0]);
    } catch (e) { errorServidor(res, e, "No se pudo consultar el cliente"); }
}

async function registrarCliente(req, res) {
    const b = req.body;
    const obligatorios = [
        "numrun", "dvrun", "pnombre", "appaterno", "fecha_nacimiento",
        "fecha_inscripcion", "direccion", "cod_region", "cod_provincia",
        "cod_comuna", "cod_prof_ofic", "cod_tipo_cliente"
    ];
    const faltantes = obligatorios.filter(k => b[k] === undefined || b[k] === null || b[k] === "");
    if (faltantes.length) return res.status(400).json({ error: "Faltan campos obligatorios", campos: faltantes });

    try {
        await conConexion(cn => cn.execute(
            `INSERT INTO CLIENTE (
                numrun, dvrun, pnombre, snombre, appaterno, apmaterno,
                fecha_nacimiento, fecha_inscripcion, correo, fono_contacto,
                direccion, cod_region, cod_provincia, cod_comuna,
                cod_prof_ofic, cod_tipo_cliente
             ) VALUES (
                :numrun, :dvrun, :pnombre, :snombre, :appaterno, :apmaterno,
                TO_DATE(:fecha_nacimiento, 'YYYY-MM-DD'),
                TO_DATE(:fecha_inscripcion, 'YYYY-MM-DD'),
                :correo, :fono_contacto, :direccion, :cod_region,
                :cod_provincia, :cod_comuna, :cod_prof_ofic, :cod_tipo_cliente
             )`,
            {
                numrun: b.numrun, dvrun: b.dvrun, pnombre: b.pnombre,
                snombre: b.snombre ?? null, appaterno: b.appaterno,
                apmaterno: b.apmaterno ?? null, fecha_nacimiento: b.fecha_nacimiento,
                fecha_inscripcion: b.fecha_inscripcion, correo: b.correo ?? null,
                fono_contacto: b.fono_contacto ?? null, direccion: b.direccion,
                cod_region: b.cod_region, cod_provincia: b.cod_provincia,
                cod_comuna: b.cod_comuna, cod_prof_ofic: b.cod_prof_ofic,
                cod_tipo_cliente: b.cod_tipo_cliente
            },
            { autoCommit: true }
        ));
        res.status(201).json({ mensaje: "Cliente registrado correctamente" });
    } catch (e) { errorServidor(res, e, "No se pudo registrar el cliente"); }
}

async function actualizarCliente(req, res) {
    const b = req.body;
    const obligatorios = [
        "dvrun", "pnombre", "appaterno", "fecha_nacimiento", "direccion",
        "cod_region", "cod_provincia", "cod_comuna", "cod_prof_ofic", "cod_tipo_cliente"
    ];
    const faltantes = obligatorios.filter(k => b[k] === undefined || b[k] === null || b[k] === "");
    if (faltantes.length) return res.status(400).json({ error: "Faltan campos obligatorios", campos: faltantes });

    try {
        const result = await conConexion(cn => cn.execute(
            `UPDATE CLIENTE
                SET dvrun = :dvrun, pnombre = :pnombre, snombre = :snombre,
                    appaterno = :appaterno, apmaterno = :apmaterno,
                    fecha_nacimiento = TO_DATE(:fecha_nacimiento, 'YYYY-MM-DD'),
                    correo = :correo, fono_contacto = :fono_contacto,
                    direccion = :direccion, cod_region = :cod_region,
                    cod_provincia = :cod_provincia, cod_comuna = :cod_comuna,
                    cod_prof_ofic = :cod_prof_ofic, cod_tipo_cliente = :cod_tipo_cliente
              WHERE numrun = :numrun`,
            {
                numrun: req.params.id, dvrun: b.dvrun, pnombre: b.pnombre,
                snombre: b.snombre ?? null, appaterno: b.appaterno,
                apmaterno: b.apmaterno ?? null, fecha_nacimiento: b.fecha_nacimiento,
                correo: b.correo ?? null, fono_contacto: b.fono_contacto ?? null,
                direccion: b.direccion, cod_region: b.cod_region,
                cod_provincia: b.cod_provincia, cod_comuna: b.cod_comuna,
                cod_prof_ofic: b.cod_prof_ofic, cod_tipo_cliente: b.cod_tipo_cliente
            },
            { autoCommit: true }
        ));
        if (!result.rowsAffected) return res.status(404).json({ error: "Cliente no encontrado" });
        res.json({ mensaje: "Cliente actualizado correctamente" });
    } catch (e) { errorServidor(res, e, "No se pudo actualizar el cliente"); }
}

module.exports = { obtenerClientes, obtenerClientePorId, registrarCliente, actualizarCliente };
