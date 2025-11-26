const express =  require('express');
const router = express.Router();
const cobros = require('../controllers/cobros.controller')
const { verificarToken } = require('../middlewares/auth');
router.get('/listar',verificarToken,cobros.listar)
router.post('/vigencia',verificarToken,cobros.vigencia);
router.post('/cobrosxpago',verificarToken,cobros.cobrosxpagos);
module.exports = router;