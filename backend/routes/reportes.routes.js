const express = require("express");
const router = express.Router();

const controller = require("../controllers/reportes.controller");

router.get("/balance-anual", controller.obtenerBalanceAnual);
router.get("/balance-anual/:anio", controller.obtenerBalancePorAnio);

module.exports = router;