const express = require('express');
const routes = express.Router();
const {verificarToken} = require('../middlewares/auth');
const cobrosrController = require('../controllers/cobrosr.controller');

routes.get('/', verificarToken, cobrosrController.listarCobrosR);

exports = module.exports = routes;