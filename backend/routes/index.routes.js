const express = require("express");
const router = express.Router();

router.use("/clientes", require("./clientes.routes"));
router.use("/catalogos", require("./catalogos.routes"));
router.use("/tarjetas", require("./tarjetas.routes"));
router.use("/transacciones", require("./transacciones.routes"));
router.use("/puntos", require("./puntos.routes"));
router.use("/aportes", require("./aportes.routes"));
router.use("/reportes", require("./reportes.routes"));

module.exports = router;