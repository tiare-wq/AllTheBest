const express = require("express");
const router = express.Router();

const controller = require("../controllers/detalles.controller");

// Obtener todos los detalles
router.get("/", controller.obtenerDetalles);

// Obtener detalles por número de tarjeta
router.get("/detalles/tarjeta/puntos/:nroTarjeta", controller.obtenerDetalleTarjeta);
router.get("/detalles/tarjeta/aporte/:nroTarjeta", controller.obtenerDetalleAporteSbif);

// Obtener detalles por RUN del cliente
router.get("/cliente/:numrun", controller.obtenerDetallePorCliente);

module.exports = router;