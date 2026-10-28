const express = require("express");
const router = express.Router();

const controller = require("../controllers/clientes.controller");

router.get("/", controller.obtenerClientes);
router.get("/:id", controller.obtenerClientePorId);
router.post("/", controller.registrarCliente);
router.put("/:id", controller.actualizarCliente);

module.exports = router;