const express = require("express");
const router = express.Router();

const controller = require("../controllers/aportes.controller");

router.get("/tramos", controller.obtenerTramos);

router.get("/resumen", controller.obtenerResumenAportes);

router.get("/cliente/:idCliente", controller.obtenerAportesCliente);

module.exports = router;