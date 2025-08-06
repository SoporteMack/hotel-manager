const express = require('express');
const router = express.Router();
const personaController = require('../controllers/persona.controller');
const { verificarToken } = require('../middlewares/auth');

router.get('/listar',verificarToken,personaController.listar);
router.get('/listaactivos',verificarToken,personaController.listaActivos);
router.post('/crear',verificarToken,personaController.crear);
router.put('/actualizar/:id',verificarToken    ,personaController.actualizar);
module.exports = router;