const express = require('express');
const router = express.Router();
const contratos = require('../controllers/contrato.controller');
const { verificarToken } = require('../middlewares/auth');
const upload = require("../middlewares/uploads");
const filename = require('../middlewares/filename');
router.get('/listar',verificarToken,contratos.listar)
router.post(
  "/crear",
  verificarToken,
  upload.fields([
    { name: "ineD", maxCount: 1 },
    { name: "ineA",maxCount:1},
    { name: "comprobatededomicilio", maxCount: 1 },
    { name: "tarjetaD", maxCount: 1 },
    { name: "tarjetaA",maxCount:1}
  ]),
  contratos.crear
);
router.get('/ocupacion',verificarToken,contratos.porcentajeocupado);
router.get('/contratoxpersona',verificarToken,contratos.contratoxnombre);
module.exports = router;