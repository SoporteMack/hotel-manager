const express = require('express');
const { verificarToken } = require('../middlewares/auth');
const router = express.Router();
router.use('/personas',verificarToken,require('./personaP'));
router.use('/tarifas',verificarToken,require('./tarifa'));
module.exports = router;