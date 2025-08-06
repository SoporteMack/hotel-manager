const jwt = require('jsonwebtoken');

function verificarInicioSesion(req, res, next) {
  const token = req.cookies?.token;

  if (!token) return next();

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(400).json({ msg: "Ya estás autenticado" });
  } catch {
    return next();
  }
}

function verificarToken(req, res, next) {
  const token = req.cookies?.token;

  if (!token)
    return res.status(401).json({ msg: "No tienes autorización, token faltante" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch {
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
}

module.exports = {
  verificarInicioSesion,
  verificarToken,
};
