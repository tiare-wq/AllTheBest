const { oracledb, conConexion, errorServidor } = require("../utils/db");

function consulta(sql, mensaje, obtenerBinds = () => ({})) {
    return async (req, res) => {
        try {
            const rows = await conConexion(async cn => {
                const r = await cn.execute(sql, obtenerBinds(req), { outFormat: oracledb.OUT_FORMAT_OBJECT });
                return r.rows;
            });
            res.json(rows);
        } catch (e) { errorServidor(res, e, mensaje); }
    };
}

const obtenerTiposCliente = consulta(
    `SELECT cod_tipo_cliente, nombre_tipo_cliente, promedio_renta
       FROM TIPO_CLIENTE ORDER BY cod_tipo_cliente`,
    "No se pudieron consultar los tipos de cliente"
);
const obtenerProfesiones = consulta(
    `SELECT cod_prof_ofic, nombre_prof_ofic FROM PROFESION_OFICIO ORDER BY nombre_prof_ofic`,
    "No se pudieron consultar las profesiones"
);
const obtenerRegiones = consulta(
    `SELECT cod_region, nombre_region FROM REGION ORDER BY nombre_region`,
    "No se pudieron consultar las regiones"
);
const obtenerProvincias = consulta(
    `SELECT cod_region, cod_provincia, nombre_provincia
       FROM PROVINCIA WHERE cod_region = :cod_region ORDER BY nombre_provincia`,
    "No se pudieron consultar las provincias",
    req => ({ cod_region: req.query.cod_region })
);
const obtenerComunas = consulta(
    `SELECT cod_region, cod_provincia, cod_comuna, nombre_comuna
       FROM COMUNA
      WHERE cod_region = :cod_region
        AND cod_provincia = :cod_provincia
      ORDER BY nombre_comuna`,
    "No se pudieron consultar las comunas",
    req => ({ cod_region: req.query.cod_region, cod_provincia: req.query.cod_provincia })
);
const obtenerTiposTransaccion = consulta(
    `SELECT cod_tptran_tarjeta, nombre_tptran_tarjeta,
            tasaint_tptran_tarjeta, nro_maximo_cuotas_tran, cod_producto
       FROM TIPO_TRANSACCION_TARJETA ORDER BY cod_tptran_tarjeta`,
    "No se pudieron consultar los tipos de transacción"
);
const obtenerProductos = consulta(
    `SELECT cod_producto, nombre_producto, desc_producto,
            tasaint_producto, nro_maximo_cuotas_prod
       FROM PRODUCTO ORDER BY cod_producto`,
    "No se pudieron consultar los productos"
);

module.exports = {
    obtenerTiposCliente, obtenerProfesiones, obtenerRegiones,
    obtenerProvincias, obtenerComunas, obtenerTiposTransaccion, obtenerProductos
};
