const express = require('express');
const router = express.Router();
const detallesController = require('./../controllers/detalle.controller');
const { verificarToken } = require('../middlewares/auth');

router.get('/listar',verificarToken,detallesController.listar);
router.post('/crear',verificarToken,detallesController.crear);

module.exports = router;
