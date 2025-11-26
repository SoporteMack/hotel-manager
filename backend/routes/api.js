const express = require('express')
const routes = express.Router();
const {verificarToken} = require('../middlewares/auth')

routes.use('/persona',verificarToken,require('./personas'));
routes.use('/auth',require('./auth'));
routes.use('/usuario',require('./usuarios'));
routes.use('/contratos',verificarToken,require('./contratos'));
routes.use('/departamentos',verificarToken,require('./departamentos'));
routes.use('/cobrosr',verificarToken,require('./cobrosr'));
routes.use('/pagos',verificarToken,require('./pagos'));
routes.use('/documentos',require('./documentos'));
routes.use('/config',require('./configuracion'));
routes.use('/detalles',require('./detalle'));
routes.use('/pension',verificarToken,require('./pension'));
module.exports = routes;