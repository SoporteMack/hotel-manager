const jwt = require('jsonwebtoken');

function generarToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '1d'
  });
}

module.exports = { generarToken };