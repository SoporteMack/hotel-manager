const multer = require("multer");

const storage = multer.memoryStorage(); // Almacenamos archivos en memoria

const upload = multer({ storage });
module.exports = upload;

/*const multer = require("multer");
const path = require("path");
const fs = require("fs");
const personas = require("../models/personas");

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const { idPersona, fechaInicio } = req.body;

      if (!idPersona || !fechaInicio) {
        return cb(new Error("Faltan datos necesarios"), null);
      }

      const persona = await personas.findOne({
        attributes: ["nombrePersona", "apellidoPaterno", "apellidoMaterno"],
        where: { idPersona },
      });

      if (!persona) {
        return cb(new Error("Persona no encontrada"), null);
      }

      
      const nombre = `${persona.nombrePersona}_${persona.apellidoPaterno}_${persona.apellidoMaterno}`.replace(/\s+/g, "_");
      req.nombrecompleto = nombre;
      const fechaObj = new Date(fechaInicio);
      const fechaTexto = `contrato_${fechaObj.getDate().toString().padStart(2, "0")}_${(fechaObj.getMonth() + 1).toString().padStart(2, "0")}_${fechaObj.getFullYear()}`;

      const fullPath = path.join("uploads", nombre + "_" + fechaTexto);
      fs.mkdirSync(fullPath, { recursive: true });

      cb(null, fullPath);
    } catch (err) {
      console.error("Error en multer.diskStorage destination:", err);
      cb(err, null);
    }
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
  
    // Extrae el nombre sin "contrato_fecha"
    const nombreInquilino = req.nombrecompleto;
  
    // Construye nombre de archivo
    const nuevoNombre = `${nombreInquilino}_${file.fieldname}_${timestamp}${ext}`;
    cb(null, nuevoNombre);
  }
  
});

const upload = multer({ storage });
module.exports = upload;
*/