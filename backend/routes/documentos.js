const express =  require('express');
const router = express.Router();
const {tarjeta, comprobante,nota,solodescargacontrato, downloadContrato} = require("../controllers/documentos.controller");
const { verificarToken } = require('../middlewares/auth');

router.get('/obtenertarjetas/:fuente/:carpeta/:img/:img2',verificarToken,tarjeta);
router.get('/obtenercomprobante/:fuente/:carpeta/:img',verificarToken,comprobante);
router.get('/obtenernota',nota);
router.get('/contrato',verificarToken,solodescargacontrato);
router.get('/generarcontrato',verificarToken,downloadContrato)

module.exports=  router;