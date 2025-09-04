const express = require('express');
const router = express.Router();
const { login,validartoken, logout } = require('../controllers/auth.controller');

router.post('/login', login);
router.get('/validar',validartoken)
router.post('/logout', logout);

module.exports = router;
