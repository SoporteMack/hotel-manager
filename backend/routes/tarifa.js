const express = require('express');
const { verificarToken } = require('../middlewares/auth');
const router = express.Router();
const tarifas = require('./../controllers/tarifa.controller');
router.get('/listar',verificarToken,tarifas.listar);
router.post('/crear',verificarToken,tarifas.crear);
router.put("/actualizar/:id", tarifas.actualizar);
router.get('/listaractivos',verificarToken,tarifas.tarifasA);
module.exports = router;