const bcrypt = require("bcrypt");
const { generarToken } = require("../utils/jwt");
const Usuario = require("../models/usuarios");
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const usuarioDB = await Usuario.findOne({ where: { usuario } });

    if (!usuarioDB) {
      return res.status(401).json({ msg: "Usuario no encontrado" });
    }

    const validado = await bcrypt.compare(password, usuarioDB.password);

    if (!validado) {
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }

    const token = await generarToken({ usuario: usuarioDB.usuario });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,  // FORZAR a true porque ngrok usa HTTPS
      sameSite: 'none', // Para que se envíe en solicitudes cross-site con credenciales
      maxAge: 24 * 60 * 60 * 1000,
    });
    
    console.log(res.cookie)
    res.json({ status: true, msg: "Inicio de sesion exitoso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
const validartoken = async (req, res) => {
  const token = req.cookies?.token;
  console.log('token:',token)
    if (!token)
      return res.status(401).json({ autenticado: false});
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({ autenticado: true })
    } catch(e) {
      console.log(e)
      return res.status(401).json({ msg: "Token inválido o expirado" });
    }
};
module.exports = {
  login,
  validartoken
};
