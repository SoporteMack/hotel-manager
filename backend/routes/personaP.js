const { verificarToken } = require("../middlewares/auth");
const personapCotroller = require("../controllers/personasp.controller");
const upload = require("../middlewares/uploads");
const express = require('express');
const router = express.Router();
router.get('/listar', verificarToken, personapCotroller.listar);
router.post('/crear', verificarToken, upload.fields([
    { name: "ineD", maxCount: 1 },
    { name: "ineA", maxCount: 1 }]), personapCotroller.crear)
router.post('/actualizar', verificarToken, personapCotroller.actualizar);
router.post('/actualizarcom', verificarToken, upload.fields([{ name: "comprobatededomicilio", maxCount: 1 },]), personapCotroller.subircom);
router.post('/actualizarine', verificarToken, upload.fields([
    { name: "ineD", maxCount: 1 },
    { name: "ineA", maxCount: 1 }]), personapCotroller.subirine)
router.post('/descargarine',verificarToken,personapCotroller.descargarine);
router.post('/descargarcom',verificarToken,personapCotroller.descargarcom);
router.get('/com',verificarToken,personapCotroller.tienecom);

router.get('/nombre',verificarToken,personapCotroller.nombre);
router.get('/listaractivos',verificarToken,personapCotroller.listarlistaPension);
    module.exports = router;