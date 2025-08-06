// routes/error.js
const express = require('express');
const router = express.Router();

// Este router solo maneja 404
router.use((req, res) => {
  res.status(404).render('error/404', {
    titulo: 'Página no encontrada',
    showHeader: false,
  });
});

module.exports = router;
