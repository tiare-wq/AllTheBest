const express = require("express");
const router = express.Router();

const controller = require("../controllers/puntos.controller");

router.get("/", controller.obtenerPuntos);

router.get("/resumen", controller.obtenerResumenPuntos);

router.get("/cliente/:idCliente", controller.obtenerPuntosCliente);

router.get(
    "/cliente/:idCliente/vigentes",
    controller.obtenerPuntosVigentes
);

module.exports = router;