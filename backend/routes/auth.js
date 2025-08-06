const express = require('express');
const router = express.Router();
const { login,validartoken } = require('../controllers/auth.controller');

router.post('/login', login);
router.get('/validar',validartoken)

module.exports = router;
