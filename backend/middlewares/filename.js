const personas = require("../models/personas")

const filename = async (req, res, next) => {
const { idPersona, fechaInicio } = req.body;
  if (!idPersona || !fechaInicio) {
    return res.status(400).json({ msg: "Faltan idPersona o fechaInicio" });
  }
  try {
    const rows = await personas.findOne({
        attributes:["nombrePersona","apellidoPaterno","apellidoMaterno"],
        where:{
            idPersona:idPersona
        }
    })
    
    if (rows.length === 0) return res.status(404).json({ msg: "Inquilino no encontrado" });

    // Sanitizar nombre y formatear fecha
    const nombre = rows.nombrePersona.replace(/\s+/g, "_") +  rows.apellidoPaterno.replace(/\s+/g, "_") + rows.apellidoMaterno.replace(/\s+/g, "_");
    const fechaObj = new Date(fechaInicio);
    const fechaFormateada = `contrato_${fechaObj.getDate().toString().padStart(2, "0")}_${(fechaObj.getMonth() + 1).toString().padStart(2, "0")}_${fechaObj.getFullYear()}`;

    // Guardar en req
    req.inquilinoNombre = nombre;
    req.carpetaContrato = fechaFormateada;

    next();
  } catch (error) {
    console.error("Error al obtener nombre o procesar fecha:", error);
    res.status(500).json({ msg: "Error interno al procesar datos" });
  }
};

module.exports =  filename