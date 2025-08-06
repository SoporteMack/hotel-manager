const express =  require('express');
const router = express.Router();
const {tarjeta, comprobante,nota,reporteDiario,generarContrato} = require("../controllers/documentos.controller");
const { verificarToken } = require('../middlewares/auth');

router.get('/obtenertarjetas/:fuente/:carpeta/:img/:img2',verificarToken,tarjeta);
router.get('/obtenercomprobante/:fuente/:carpeta/:img',verificarToken,comprobante);
router.get('/obtenernota',nota);
//router.get('/reportediario',reporteDiario);
router.get('/generarcontrato',generarContrato)

module.exports=  router;