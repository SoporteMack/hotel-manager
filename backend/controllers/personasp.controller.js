const PersonaP = require('../models/personasP');
const fs = require("fs");
const path = require('path');
const PDFDocument = require("pdfkit");
const { getSock } = require('../utils/baileys');
const Configuracion = require("../models/configuracion");
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
    console.log(data)
    // 1. Buscar persona en DB
    const persona = await PersonaP.create(data);

    if (!persona) {
      return res.status(404).json({ message: "Persona no encontrada" });
    }

    // 2. Nombre y carpeta donde guardar
    const nombreCarpeta = `${persona.idPersona}_${persona.nombre}_${persona.apellido}`.replace(/\s+/g, "_");
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
    if (files) {
      // Asumiendo que recibes ineD (delantera) y ineA (trasera)
      const ineD = files.ineD?.[0];
      const ineA = files.ineA?.[0];

      if (ineD && ineA) {
        try {
          doc.addPage();

          // Imagen frontal (izquierda)
          doc.image(ineD.buffer, 70, 150, {
            fit: [220, 140], // ancho x alto
            align: "center",
            valign: "center",
          });

          // Imagen trasera (derecha)
          doc.image(ineA.buffer, 320, 150, {
            fit: [220, 140],
            align: "center",
            valign: "center",
          });

        } catch (e) {
          console.error("Error agregando imágenes:", e);
        }
      }
    }

    doc.end();
    persona.update({ INE: rutaPDF });
    await mensajeBienvenida(persona.telefono,persona.nombre + ' ' + persona.apellido);
    // 5. Responder cuando termine
    stream.on("finish", () => {
      res.json({
        message: "PDF creado correctamente",
        archivo: rutaPDF
      });
    });
    res.status(200).json("creado")
  } catch (error) {
    console.error("Error en crear:", error);
    res.status(500).json({ message: "Error al crear PDF", error: error.message });
  }
};

exports.actualizar = async (req, res) => {
  const data = req.body;
  try {
    await PersonaP.update(
      {
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
        telefono2: data.telefono2
      },
      {
        where: { idPersona: data.idPersona },
      }
    );
    res.status(200).json("persona actualizado correctamente");
  } catch (error) {
    console.log(error)
    res.status(500).json("erro al actualizar persona");
  }
}

exports.subircom = async (req, res) => {
  try {
    const data = req.body;
    const files = req.files;
    console.log(files);

    const persona = await PersonaP.findByPk(data.idPersona);
    if (!persona) {
      return res.status(404).json({ message: "Persona no encontrada" });
    }

    // Carpeta destino
    const nombreCarpeta = `${persona.idPersona}_${persona.nombre}_${persona.apellido}`.replace(/\s+/g, "_");
    const carpeta = path.join("uploads", "Pensiones", nombreCarpeta);

    if (!fs.existsSync(carpeta)) {
      fs.mkdirSync(carpeta, { recursive: true });
    }

    // Nombre del archivo PDF
    const nombrePDF = `${nombreCarpeta}_com.pdf`;
    const rutaPDF = path.join(carpeta, nombrePDF);

    // Crear PDF con PDFKit
    const doc = new PDFDocument({ autoFirstPage: false });
    const stream = fs.createWriteStream(rutaPDF);
    doc.pipe(stream);

    if (files) {
      const comprobante = files.comprobatededomicilio?.[0];

      if (comprobante) {
        try {
          doc.addPage();

          // Usa el buffer directamente
          doc.image(comprobante.buffer, 0, 0, {
            fit: [doc.page.width, doc.page.height],
            align: "center",
            valign: "center",
          });
        } catch (e) {
          console.error("Error agregando comprobante:", e);
        }
      }
    }

    doc.end();

    await persona.update({ comprobanteDeDomicilio: rutaPDF });
    await persona.save();

    stream.on("finish", () => {
      res.json({
        message: "PDF creado correctamente",
        archivo: rutaPDF,
      });
    });
  } catch (error) {
    console.error("Error en crear:", error);
    res.status(500).json({ message: "Error al crear PDF", error: error.message });
  }
};

exports.subirine = async (req, res) => {
  try {
    const data = req.body;
    const files = req.files; // Deben venir como array: [img1, img2]
    console.log(data)
    // 1. Buscar persona en DB
    const persona = await PersonaP.findByPk(data.idPersona);

    if (!persona) {
      return res.status(404).json({ message: "Persona no encontrada" });
    }

    // 2. Nombre y carpeta donde guardar
    const nombreCarpeta = `${persona.idPersona}_${persona.nombre}_${persona.apellido}`.replace(/\s+/g, "_");
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
    if (files) {
      // Asumiendo que recibes ineD (delantera) y ineA (trasera)
      const ineD = files.ineD?.[0];
      const ineA = files.ineA?.[0];

      if (ineD && ineA) {
        try {
          doc.addPage();

          // Imagen frontal (izquierda)
          doc.image(ineD.buffer, 70, 150, {
            fit: [220, 140], // ancho x alto
            align: "center",
            valign: "center",
          });

          // Imagen trasera (derecha)
          doc.image(ineA.buffer, 320, 150, {
            fit: [220, 140],
            align: "center",
            valign: "center",
          });

        } catch (e) {
          console.error("Error agregando imágenes:", e);
        }
      }
    }

    doc.end();
    persona.update({ INE: rutaPDF });
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
}

exports.descargarine = async (req, res) => {
  try {
    const { url } = req.body;
    const pathdoc = __dirname + '/../' + url;
    console.log(pathdoc)
    // Enviar PDF al cliente
    res.download(pathdoc, "ine.pdf", (err) => {
      if (err) {
        console.error("Error al enviar el PDF:", err);
        return res.status(500).send("No se pudo enviar el PDF");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

exports.descargarcom = async (req, res) => {
  try {
    const { url } = req.body;
    const pathdoc = __dirname + '/../' + url;
    console.log(pathdoc)
    // Enviar PDF al cliente
    res.download(pathdoc, "comprobante.pdf", (err) => {
      if (err) {
        console.error("Error al enviar el PDF:", err);
        return res.status(500).send("No se pudo enviar el PDF");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

exports.tienecom = async (req, res) => {
  try {

    const idPersona = req.query.idPersona;
    console.log(idPersona)
    var band = false;
    const persona = await PersonaP.findByPk(idPersona);
    if (persona.comprobanteDeDomicilio)
      band = true
    return res.status(200).json({ com: band });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ com: false });
  }
}
exports.nombre = async (req,res) =>
{
  try {
    const idPersona = req.query.idPersona;
    const persona = await PersonaP.findByPk(idPersona);
    var nombre = "sin Nombre";
    if(persona)
    {
      nombre = persona.nombre + " " + persona.apellido;
    }
    return res.status(200).json({nombre:nombre});
  } catch (error) {
    return res.status(500).json(error);
  }
}

const mensajeBienvenida = async (telefono,nombre) => {
  const sock = getSock(); 
  const res = await Configuracion.findOne();
  const msj = res?.bienvenidaP ?? "¡Bienvenido!";

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
  }finally{
    const numeroadmin = '521' + res.telefono;
    const [resulta] = await sock.onWhatsApp(numeroadmin + "@s.whatsapp.net");
    await sock.sendMessage(resulta.jid, { text: 'Se agrego persona para pensión \n\n'+nombre });
  }
};

