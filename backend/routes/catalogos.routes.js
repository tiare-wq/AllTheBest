const express = require("express");
const router = express.Router();

const controller = require("../controllers/catalogos.controller");

router.get("/tipos-cliente", controller.obtenerTiposCliente);
router.get("/profesiones", controller.obtenerProfesiones);

router.get("/regiones", controller.obtenerRegiones);
router.get("/provincias", controller.obtenerProvincias);
router.get("/comunas", controller.obtenerComunas);

router.get("/tipos-transaccion", controller.obtenerTiposTransaccion);
router.get("/productos", controller.obtenerProductos);

module.exports = router;