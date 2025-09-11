const PersonaP = require('../models/personasP');
const  fs =require("fs");
const  path = require('path');
const  PDFDocument = require("pdfkit");
exports.listar = async (req, res) => {
    try {
        const response = await PersonaP.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

exports.crear = async (req, res) => {
    try {
      const data = req.body;
      const files = req.files; // Deben venir como array: [img1, img2]
  
      // 1. Buscar persona en DB
      const persona = await PersonaP.findOne({
        attributes: ["nombre", "apellido"],
        where: { idPersona: data.idPersona }
      });
  
      if (!persona) {
        return res.status(404).json({ message: "Persona no encontrada" });
      }
  
      // 2. Nombre y carpeta donde guardar
      const nombreCarpeta = `${data.idPersona}_${persona.nombre}_${persona.apellido}`.replace(/\s+/g, "_");
      const carpeta = path.join("uploads", "Pensiones", nombreCarpeta);
  
      if (!fs.existsSync(carpeta)) {
        fs.mkdirSync(carpeta, { recursive: true });
      }
  
      // 3. Nombre del archivo PDF
      const nombrePDF = `${nombreCarpeta}.pdf`;
      const rutaPDF = path.join(carpeta, nombrePDF);
  
      // 4. Crear PDF con PDFKit
      const doc = new PDFDocument({ autoFirstPage: false });
      const stream = fs.createWriteStream(rutaPDF);
      doc.pipe(stream);
  
      // --- Página 1: datos de la persona ---
      doc.addPage()
        .fontSize(16).text("Datos de la Persona", { align: "center" })
        .moveDown()
        .fontSize(12)
        .text(`ID: ${data.idPersona}`)
        .text(`Nombre: ${persona.nombre} ${persona.apellido}`)
        .moveDown();
  
      // --- Insertar imágenes si existen ---
      if (files && files.length > 0) {
        files.forEach((file, index) => {
          try {
            doc.addPage()
              .fontSize(14)
              .text(`Imagen ${index + 1}`, { align: "center" })
              .moveDown();
  
            doc.image(file.path, {
              fit: [500, 500],
              align: "center",
              valign: "center"
            });
          } catch (e) {
            console.error("Error agregando imagen:", e);
          }
        });
      }
  
      doc.end();
  
      // 5. Responder cuando termine
      stream.on("finish", () => {
        res.json({
          message: "PDF creado correctamente",
          archivo: rutaPDF
        });
      });
  
    } catch (error) {
      console.error("Error en crear:", error);
      res.status(500).json({ message: "Error al crear PDF", error: error.message });
    }
  };