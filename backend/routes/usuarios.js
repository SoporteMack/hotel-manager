const express = require('express');
const router = express.Router();
const controllerUsuarios = require('../controllers/usuario.controller');
router.post('/crearusuario',controllerUsuarios.crearusuario);
module.exports = router;