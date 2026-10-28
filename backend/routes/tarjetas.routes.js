const express = require("express");
const router = express.Router();

const controller = require("../controllers/tarjetas.controller");

router.get("/", controller.obtenerTarjetas);
router.get("/:id", controller.obtenerTarjetaPorId);
router.get("/cliente/:idCliente", controller.obtenerTarjetasPorCliente);
router.post("/", controller.registrarTarjeta);

module.exports = router;