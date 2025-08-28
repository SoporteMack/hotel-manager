const express = require('express');
const router = express.Router();
const departamentos = require('../controllers/departamento.controller');
const { verificarToken } = require('../middlewares/auth');

router.get('/listar',verificarToken,departamentos.listar);
router.get('/listardepartamentosactivo',verificarToken,departamentos.listarActivos);
router.get('/listardepartamentosactivoyactual',verificarToken,departamentos.listarActivosyActual);
router.post('/crear',verificarToken,departamentos.crear);
router.put('/actualizar/:numDep',verificarToken,departamentos.actualizar);
module.exports = router;