const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const { listar, crear, listarxfecha,diferencia } = require('../controllers/pagosp.controller');
router.get('/listar',verificarToken,listar);
router.post('/crear',verificarToken,crear);
router.get('/listarxfecha',verificarToken,listarxfecha);
router.post('/diferencia',verificarToken,diferencia);
module.exports = router;