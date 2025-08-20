const express = require('express')
const routes = express.Router();
const {verificarToken} = require('../middlewares/auth')

routes.use('/persona',verificarToken,require('./personas'));
routes.use('/auth',require('./auth'));
routes.use('/usuario',require('./usuarios'));
routes.use('/contratos',verificarToken,require('./contratos'));
routes.use('/departamentos',verificarToken,require('./departamentos'));
routes.use('/pagos',verificarToken,require('./pagos'));
routes.use('/documentos',require('./documentos'));
routes.use('/config',require('./configuracion'));
module.exports = routes;