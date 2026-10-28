const express = require("express");
const router = express.Router();

const controller = require("../controllers/transacciones.controller");

router.get("/", controller.obtenerTransacciones);

router.get("/cliente/:idCliente", controller.obtenerTransaccionesPorCliente);

router.post("/", controller.registrarTransaccion);

router.get(
    "/:nroTarjeta/:nroTransaccion/cuotas",
    controller.obtenerCuotas
);

router.post(
    "/:nroTarjeta/:nroTransaccion/cuotas/:nroCuota/pagos",
    controller.registrarPagoCuota
);

router.get(
    "/:nroTarjeta/:nroTransaccion",
    controller.obtenerTransaccionPorId
);

module.exports = router;