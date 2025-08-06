const usuariomodel = require('../models/usuarios');
const bcrypt = require('bcrypt');
exports.findusuario= async (req,res) =>
{
    const {usuario,pwd} = req.body;
    const usuarioBD = usuario.findOne({where:{usuario}});
    res.json(usuarioBD); 
}

exports.crearusuario = async (req,res)=>{
    try{
    const {usuario,password} = req.body;
    const hash = await bcrypt.hash(password, 10);
    const usuarioBD = usuariomodel.create({usuario:usuario,password:hash});

    
     // Responder al cliente
     res.status(201).json({ mensaje: 'Usuario creado', usuario: usuarioBD.usuario });
    } catch (error) {
      //console.error(error);
      res.status(500).json({ mensaje: 'Error al crear usuario' });}
}
