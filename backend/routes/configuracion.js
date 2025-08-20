const express  = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const { listar, actualizar } = require("../controllers/configuracion.controller");

router.get('/listar',verificarToken,listar);
router.post('/actualizar',verificarToken,actualizar);
module.exports = router;