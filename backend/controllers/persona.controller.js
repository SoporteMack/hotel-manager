const { where } = require("sequelize");
const persona = require("../models/personas");

exports.listar = async (req,res) =>{
    const lista = await persona.findAll();
    res.json(lista);
}

exports.crear = async (req,res)=>{
   try{
    const {nombrePersona,apellidoPaterno,apellidoMaterno,telefono,correo} = req.body;
    const personabd= await persona.create({
        nombrePersona:nombrePersona,
        apellidoPaterno:apellidoPaterno,
        apellidoMaterno:apellidoMaterno,
        telefono:telefono,
        correo:correo
    });
    res.status(201).json({status:true,msj:"Inquilino Creado con Exito"})
   }catch(e)
   {
    if (e.name === 'SequelizeValidationError') {
        const errores = e.errors.map(err => ({
          campo: err.path,
          mensaje: err.message
        }));
        return res.status(400).json({ status: false, errores });
      }
    
      res.status(500).json({ mensaje: 'Error inesperado' });
   }
}

exports.actualizar = async (req, res) => {
  try {
    const id = req.params.id; 
    const datos = req.body;   

    const personaEncontrada = await persona.findByPk(id);

    if (!personaEncontrada) {
      return res.status(404).json({ status: false, mensaje: 'Persona no encontrada' });
    }
    await personaEncontrada.update(datos);

    res.status(200).json({ status: true, mensaje: 'Persona actualizada con éxito' });
  } catch (e) {
    if (e.name === 'SequelizeValidationError') {
      const errores = e.errors.map(err => ({
        campo: err.path,
        mensaje: err.message
      }));
      return res.status(400).json({ status: false, errores });
    }

    console.error(e);
    res.status(500).json({ status: false, mensaje: 'Error al actualizar la persona' });
  }
};

exports.listaActivos = async (req,res) =>
{
  try{
    const lista = await persona.findAll({
      attributes:['idPersona','nombrePersona','apellidoPaterno','apellidoMaterno'],
      where:{
        estatus:true
      }
    })
    res.status(200).json({estatus:true,lista:lista});
  }catch(e)
  {
    console.log(e)
    res.status(500).json({msg:"error al consultar lista de personal"});
  }
}