const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const contratos = require('../models/contratos');
const pagos = require('../models/pagos');
const personas = require('../models/personas');
const departamentos = require('../models/departamentos');
const { Op, json } = require("sequelize");
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const mammoth = require('mammoth'); // para convertir docx a HTML
const puppeteer = require('puppeteer');
exports.tarjeta = async (req, res) => {
  try {
    const img = req.params.img;
    const img2 = req.params.img2;
    const fuente = req.params.fuente;
    const carpeta = req.params.carpeta;
    const pathdoc = fuente + "/" + carpeta + "/" + img;
    const pathdoc2 = fuente + "/" + carpeta + "/" + img2;
    const imgpath = path.join(__dirname, '..', pathdoc);
    const imgpath2 = path.join(__dirname, '..', pathdoc2);
    if (!fs.existsSync(imgpath) && !fs.existsSync(imgpath2)) {
      return res.status(404).send('Imagen no encontrada');
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${img}.pdf`);
    const doc = new PDFDocument();
    doc.pipe(res);
    const imgWidth = 300;
    const y = doc.y;
    doc.image(imgpath, 20, y, { fit: [imgWidth, 200] }); // izquierda
    doc.image(imgpath2, doc.page.width - imgWidth, y, { fit: [imgWidth, 200] }); // derecha
    doc.end()
  } catch (error) {
    console.log(error);
    res.status(505).json(error);
  }
}


exports.comprobante = async (req, res) => {
  try {
    const { img, fuente, carpeta } = req.params;
    const pathdoc = path.join(__dirname, '..', fuente, carpeta, img);

    if (!fs.existsSync(pathdoc)) {
      return res.status(404).send('Imagen no encontrada');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${img}.pdf`);

    const margen = 40; // margen de seguridad
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: margen,
        bottom: margen,
        left: margen,
        right: margen,
      }
    });

    doc.pipe(res);

    // Cargar imagen ajustada a toda la hoja menos los márgenes
    doc.image(pathdoc, {
      fit: [doc.page.width - 2 * margen, doc.page.height - 2 * margen],
      align: 'center',
      valign: 'center'
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al generar comprobante', error });
  }
};


exports.nota = async (req, res) => {
  try {
    const folio = req.query.folio;
    const dato = await contrato(folio);

    if (dato === null)
      return res.status(500).json("datos no econtrados");
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=nota.pdf`);

    // Simulación de datos
    const nota = {
      folio: dato.folio,
      fecha: new Date(dato.fechaPago).toLocaleDateString(),
      cliente: {
        nombre: `${dato['contrato.persona.nombrePersona']} ${dato['contrato.persona.apellidoPaterno']} ${dato['contrato.persona.apellidoMaterno']}`,
        direccion: '4 Poniente 1414, Puebla',
      },
      productos: [
        { descripcion: 'Abono renta', cantidad: 1, precio: dato.monto },
      ],
    };

    // Calcular totales
    nota.total = nota.productos.reduce((sum, p) => sum + p.cantidad * p.precio, 0);

    // Crear PDF
    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);


    // Encabezado
    doc
      .fontSize(18)
      .text('Nota de Servicio', { align: 'right' })
      .fontSize(10)
      .text(`Folio: ${nota.folio}`, { align: 'right' })
      .text(`Fecha: ${nota.fecha}`, { align: 'right' });

    doc.moveDown();

    // Cliente
    doc
      .fontSize(12)
      .text(`Cliente: ${nota.cliente.nombre}`)
      .text(`Dirección: ${nota.cliente.direccion}`);

    doc.moveDown();

    // Tabla de productos
    doc.fontSize(12).text('Detalle de Servicios:', { underline: true });

    const tableTop = doc.y + 10;
    const itemX = 40;
    const qtyX = 300;
    const priceX = 360;
    const totalX = 440;

    doc
      .fontSize(10)
      .text('Descripción', itemX, tableTop)
      .text('Cant.', qtyX, tableTop)
      .text('Precio', priceX, tableTop)
      .text('Total', totalX, tableTop);

    let y = tableTop + 15;

    nota.productos.forEach((item) => {
      const total = item.cantidad * item.precio;

      doc
        .text(item.descripcion, itemX, y)
        .text(item.cantidad, qtyX, y)
        .text(`$${item.precio}`, priceX, y)
        .text(`$${total}`, totalX, y);

      y += 20;
    });

    doc
      .fontSize(12)
      .text(`TOTAL: $${nota.total}`, totalX, y + 10, { bold: true });

    doc.moveDown(2);

    // Pie de página
    doc
      .fontSize(10)
      .text('Gracias por su preferencia.', { align: 'center' })
      .text('Este documento no es un comprobante fiscal.', { align: 'center' });

    doc.end();
  } catch (error) {
    return res.status(500).json(error);
  }

}


exports.reportediario = async () => {
  try {
    const vencidas = [
      { nombre: 'Carlos Ruiz', departamento: 'Depto 303', fecha: '2025-07-25' },
      { nombre: 'Lucía Torres', departamento: 'Depto 404', fecha: '2025-07-27' },
    ]
    const fecha = new Date().toLocaleDateString();
    const pagos = await pagosbd(fecha);
    const filePath = path.join(__dirname, '../uploads/reporte diario.pdf');
    const pagosAgrupados = {};
    rentasvencidas();
    pagos.forEach(p => {
      if (!pagosAgrupados[p.nombre]) {
        pagosAgrupados[p.nombre] = [];
      }
      pagosAgrupados[p.nombre].push(p);
    });
    const totalPagos = pagos.reduce((total, item) => total + item.monto, 0);
    const ocupados = 8;

    const disponibles = 2;
    const doc = new PDFDocument({ margin: 40 });

    doc.pipe(fs.createWriteStream(filePath));
    // Título principal
    // Encabezado principal
    doc
      .fontSize(20)
      .fillColor('#1A237E') // Azul oscuro
      .font('Helvetica-Bold')
      .text('Reporte Diario General', { align: 'center' });

    doc
      .moveDown(0.5)
      .fontSize(10)
      .fillColor('#444')
      .text(`Fecha: ${fecha}`, { align: 'right' })
      .moveDown(1);

    // Línea decorativa
    doc
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .strokeColor('#1A237E')
      .lineWidth(1.5)
      .stroke()
      .moveDown(1);

    // 🟦 RESUMEN GENERAL
    doc
      .fontSize(13)
      .fillColor('#0D47A1')
      .font('Helvetica-Bold')
      .text('Resumen General');

    doc
      .moveDown(0.5)
      .font('Helvetica')
      .fontSize(11)
      .fillColor('#333')
      .text(`Total de pagos del día:`, { continued: true })
      .fillColor('#2E7D32')
      .text(` $${totalPagos.toFixed(2)}`);

    doc
      .fillColor('#333')
      .text(`Departamentos ocupados:`, { continued: true })
      .fillColor('#1976D2')
      .text(` ${ocupados}`);

    doc
      .fillColor('#333')
      .text(`Departamentos disponibles:`, { continued: true })
      .fillColor('#F57C00')
      .text(` ${disponibles}`);

    doc.moveDown(1);

    // Línea
    doc
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .strokeColor('#1A237E')
      .lineWidth(1)
      .stroke()
      .moveDown(1);

    //  PAGOS REALIZADOS
    doc
      .font('Helvetica-Bold')
      .fontSize(13)
      .fillColor('#1565C0')
      .text('Pagos Realizados Hoy');

    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(10).fillColor('#000');
    console.log("tres")
    if (pagos.length === 0) {
      doc.text('No se registraron pagos el día de hoy.');
    } else {
      Object.keys(pagosAgrupados).forEach(nombre => {
        doc
          .font('Helvetica-Bold')
          .fillColor('#000')
          .text(nombre);

        pagosAgrupados[nombre].forEach(p => {
          doc
            .font('Helvetica')
            .fillColor('#666')
            .text(`  • ${p.departamento} - $${p.monto.toFixed(2)} - ${p.fecha} - folio ${p.folio}`);
        });

        doc.moveDown(0.8); // Espacio entre personas
      });
    }
    doc.moveDown(1);

    // ⚠️ RENTAS VENCIDAS
    doc
      .font('Helvetica-Bold')
      .fontSize(13)
      .fillColor('#C62828')
      .text('Rentas Vencidas');

    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(10).fillColor('#000');

    if (vencidas.length === 0) {
      doc.text('No hay rentas vencidas.');
    } else {
      vencidas.forEach(r => {
        doc
          .fillColor('#000')
          .text(`• ${r.nombre}`, { continued: true })
          .fillColor('#666')
          .text(` - ${r.departamento} - Venció el ${r.fecha}`);
        doc.moveDown(0.3);
      });
    }
    doc.end();
 
    return { estatus: true };


  } catch (error) {
    return { estatus: false };
  }

}

exports.generarContrato = async (req, res) => {

  try {
    const datos = {
      nombre: "JAIRO JESUS REYES JIMENEZ",
      direccion: "sin direccion",
      bcomp: "×",
      bpriv: "×",
      cocina: "×",
      sala: "×",
      lavado: "×"

    }
    const outputPdfPath = path.resolve(__dirname, '../uploads/templates/', 'contrato_final.pdf');
    const contenido = fs.readFileSync(path.resolve(__dirname, '../uploads/templates/test.docx'), 'binary');
    const zip = new PizZip(contenido);
    const options = {
      delimiters: {
        start: "{",
        end: "}",
      },
    };
    const doc = new Docxtemplater(zip, options);

    try {
      doc.render(datos);
    } catch (error) {
      console.error('Error al renderizar docx:', error);
      throw error;
    }
    const bufferDocx = doc.getZip().generate({ type: 'nodebuffer' });
    const tempDocxPath = path.resolve(__dirname, 'temp.docx');
    fs.writeFileSync(tempDocxPath, bufferDocx);
    // Convertir docx a HTML con mammoth
    const { value: html } = await mammoth.convertToHtml({ path: tempDocxPath });

    // Lanzar Puppeteer para generar PDF desde HTML
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: __dirname + '/../uploads/templates/' + 'contrato_final.pdf',
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    });

    await browser.close();

    // Opcional: borrar temp docx
    fs.unlinkSync(tempDocxPath);
    console.log(outputPdfPath)
    return res.download(outputPdfPath, 'contrato_final.pdf', (err) => {
      if (err) {
        console.error('Error al enviar el PDF:', err);
        return res.status(500).send('No se pudo enviar el PDF');
      }

      // Eliminar el PDF después de enviarlo si quieres
      fs.unlinkSync(outputPdfPath);
    });


  } catch (error) {
    console.error('Error al generar contrato:', error);
    res.status(500).send('Error generando el contrato');
  }
};

const contrato = async (folio) => {
  const data = await pagos.findOne({
    attributes: ["folio", "monto", "fechaPago", "numPago"],
    where: { folio: folio },
    include: [{
      model: contratos,
      as: "contrato",
      attributes: ["idContrato"],
      include: [
        {
          model: personas,
          as: "persona",
          attributes: ["nombrePersona", "apellidoPaterno", "apellidoMaterno"]
        },
        {
          model: departamentos,
          as: "departamento",
          attributes: ["descripcion"]
        }
      ]
    }],
    raw: true
  })
  return data;
}

const pagosbd = async (fecha) => {
  const nuevafecha = fromatearfecha(fecha);
  const inicio = nuevafecha + " 00:00:00";
  const fin = nuevafecha + " 23:59:59";
  const response = await pagos.findAll(
    {
      attributes: ["folio", "monto", "fechaPago"],
      include: [
        {
          model: contratos,
          as: "contrato",
          attributes: ["idcontrato"],
          include: [
            {
              model: personas,
              as: "persona",
              attributes: ["nombrePersona", "apellidoPaterno", "apellidoMaterno"]
            },
            {
              model: departamentos,
              as: "departamento",
              attributes: ["descripcion"]
            }
          ]
        }
      ],
      where: {
        fechaPago: {
          [Op.gte]: inicio,
          [Op.lt]: fin
        }
      },
      raw: true
    }
  )
  const data = response.map(item => {
    return {
      folio: item.folio,
      nombre: `${item['contrato.persona.nombrePersona']} ${item['contrato.persona.apellidoPaterno']} ${item['contrato.persona.apellidoMaterno']}`,
      departamento: item['contrato.departamento.descripcion'],
      monto: item.monto,
      fecha: new Date(item.fechaPago).toLocaleDateString()
    }
  })
  return data;
}

const rentasvencidas = async () => {
  const response = await contratos.findAll({
    attributes: ["deuda"],
    include: [
      {
        model: personas,
        as: "persona",
        attributes: ["nombrePersona", "apellidoPaterno", "apellidoMaterno"]
      },
      {
        model: departamentos,
        as: "departamento",
        attributes: ["descripcion"]
      }
    ],
    where: { deuda: { [Op.gt]: 0 } }
  })
  console.log(response);
}

const fromatearfecha = (fecha) => {
  const [dia, mes, anio] = fecha.split('/')
  return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

// 1. Crear un PDF temporal con pdfkit (contenido nuevo)
function createPDFBuffer(contentCallback) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    contentCallback(doc); // Aquí metes el contenido nuevo
    doc.end();
  });
}