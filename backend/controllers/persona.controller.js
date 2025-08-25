const { where } = require("sequelize");
const persona = require("../models/personas");
const { getSock } = require('../utils/baileys');
const Configuracion = require("../models/configuracion");

exports.listar = async (req,res) =>{
    const lista = await persona.findAll();
    res.json(lista);
}

exports.crear = async (req,res)=>{
   try{
    const {nombrePersona,apellidoPaterno,apellidoMaterno,telefono,correo} = req.body;
   const personabd = await persona.create({
        nombrePersona:nombrePersona,
        apellidoPaterno:apellidoPaterno,
        apellidoMaterno:apellidoMaterno,
        telefono:telefono,
        correo:correo
    });
    const nomcom = personabd.nombrePersona + " " + personabd.apellidoPaterno + " " + personabd.apellidoMaterno;
    mensajeBienvenida(telefono,nomcom);
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

const mensajeBienvenida = async (telefono,nombre) => {
  const sock = getSock(); 
  const res = await Configuracion.findOne();
  const msj = res?.bienvenida ?? "¡Bienvenido!";

  if (!sock) {
    console.log(' Sock aún no está listo');
    return;
  }

  const numero = '521' + telefono; // México (52) + 1

  try {
    // Verificar si el número existe en WhatsApp
    const [result] = await sock.onWhatsApp(numero + "@s.whatsapp.net");
    if (!result || !result.exists) {
      console.log(`El número ${telefono} no está en WhatsApp`);
      return;
    }

    // Enviar mensaje si existe
    await sock.sendMessage(result.jid, { text: nombre+'\n\n' +msj });
    console.log(`Mensaje enviado a ${telefono}`);
  } catch (error) {
    console.log("Error al enviar mensaje:", error);
  }
};
