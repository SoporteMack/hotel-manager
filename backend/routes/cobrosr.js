const express = require('express');
const routes = express.Router();
const {verificarToken} = require('../middlewares/auth');
const cobrosrController = require('../controllers/cobrosr.controller');

routes.get('/', verificarToken, cobrosrController.listarCobrosR);
routes.post('/ultimoCobroContrato', verificarToken, cobrosrController.ultimoCobroContrato);
routes.post('/pagosxcobro', verificarToken, cobrosrController.pagosxcobro); 

exports = module.exports = routes;