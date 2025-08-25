const fs = require('fs');
const { getSock } = require('../utils/baileys');
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
const { buscarRentasVencidas } = require('./contrato.controller');
const Configuracion = require('../models/configuracion');
exports.tarjeta = async (req, res) => {
  try {
    const { img, img2, fuente, carpeta } = req.params;

    const pathdoc = path.join(__dirname, "..", fuente, carpeta, img);
    const pathdoc2 = path.join(__dirname, "..", fuente, carpeta, img2);

    if (!fs.existsSync(pathdoc) || !fs.existsSync(pathdoc2)) {
      return res.status(404).send("Una o ambas imágenes no se encontraron");
    }

    // Cabeceras para descarga directa
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${img.replace(/\.[^/.]+$/, "")}.pdf`
    );

    // Crear PDF
    const doc = new PDFDocument({ margin: 20 });
    doc.pipe(res);

    const imgWidth = 250;
    const y = 50;

    // Imagen izquierda
    doc.image(pathdoc, 20, y, { fit: [imgWidth, 200] });

    // Imagen derecha (alineada al borde derecho con margen)
    doc.image(pathdoc2, doc.page.width - imgWidth - 20, y, {
      fit: [imgWidth, 200],
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};


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


exports.nota = async (folio) => {
  try {
    const dato = await contrato(folio);
    const filePath = path.join(__dirname, '../uploads/nota.pdf');

    // Simulación de datos
    const nota = {
      folio: dato.folio,
      fecha: new Date(dato.fechaPago).toLocaleDateString(),
      cliente: {
        nombre: `${dato['contrato.persona.nombrePersona']} ${dato['contrato.persona.apellidoPaterno']} ${dato['contrato.persona.apellidoMaterno']}`,
        direccion: '4 Poniente 1414, Puebla',
      },
      productos: [
        { descripcion: `Abono renta ${dato['contrato.departamento.descripcion']}`, cantidad: 1, precio: dato.monto },
      ],
    };

    // Calcular totales
    nota.total = nota.productos.reduce((sum, p) => sum + p.cantidad * p.precio, 0);

    // Crear PDF
    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(fs.createWriteStream(filePath));


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
    const rentasvencidas = await buscarRentasVencidas();
    const fecha = new Date().toLocaleDateString();
    const pagos = await pagosbd(fecha);
    const filePath = path.join(__dirname, '../uploads/reporte diario.pdf');
    const pagosAgrupados = {};
    const depocupados = 
    pagos.forEach(p => {
      if (!pagosAgrupados[p.nombre]) {
        pagosAgrupados[p.nombre] = [];
      }
      pagosAgrupados[p.nombre].push(p);
    });
    const totalPagos = pagos.reduce((total, item) => total + item.monto, 0);
    const ocupados = await contarDepartamentos(1);
    const disponibles = await contarDepartamentos(0);
    const doc = new PDFDocument({ margin: 40 });

    doc.pipe(fs.createWriteStream(filePath));
    // Título principal
    // Encabezado principal
    doc
      .fontSize(20)
      .fillColor('#FFFFFF') // Azul oscuro
      .font('Helvetica-Bold')
      .text('Reporte Diario General', { align: 'center' });

    doc
      .moveDown(0.5)
      .fontSize(10)
      .fillColor('#1A237E')
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

    try {
      if (!rentasvencidas || !Array.isArray(rentasvencidas)) {
        throw new Error('Datos de rentas vencidas no válidos');
      }
    
      if (rentasvencidas.length === 0) {
        doc.text('No hay rentas vencidas.', { align: 'center' });
      } else {
        rentasvencidas.forEach((r, index) => {
          // Validación de objeto principal
          if (!r || typeof r !== 'object') {
            doc.text(`Registro ${index + 1} inválido`, { align: 'left' });
            return;
          }
    
          // Encabezado con nombre del inquilino (con validación)
          const nombreCompleto = [
            r["persona.nombrePersona"] || 'Nombre no disponible',
            r["persona.apellidoPaterno"] || '',
            r["persona.apellidoMaterno"] || ''
          ].join(' ').trim();
    
          doc
            .fillColor('#000')
            .font('Helvetica-Bold')
            .text(`• ${nombreCompleto}`, { underline: true });
          
          doc.moveDown(0.5);
        
          // Detalles del departamento (con validación)
          const departamento = r["departamento.descripcion"] || 'No especificado';
          const contratoId = r.idContrato || 'N/A';
          
          doc
            .font('Helvetica-Bold')
            .fillColor('#333')
            .text('Departamento: ', { continued: true })
            .font('Helvetica')
            .fillColor('#666')
            .text(`${departamento} (Contrato #${contratoId})`);
        
          // Detalles de deuda (con validación y formato seguro)
          let deudaTexto = '$0.00 MXN';
          try {
            const deudaValor = parseFloat(r.deuda) || 0;
            deudaTexto = `$${deudaValor.toLocaleString('es-MX', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })} MXN`;
          } catch (e) {
            console.error('Error formateando deuda:', e);
          }
    
          doc
            .font('Helvetica-Bold')
            .fillColor('#333')
            .text('Deuda pendiente: ', { continued: true })
            .font('Helvetica')
            .fillColor('#E74C3C')
            .text(deudaTexto);
    
          // Detalles del último pago (con validación completa)
          if (r.ultimoPago && typeof r.ultimoPago === 'object') {
            // Formatear fecha
            let fechaPagoTexto = 'sin fecha';
            try {
              if (r.ultimoPago.fechaPago) {
                const fechaPago = new Date(r.ultimoPago.fechaPago);
                if (!isNaN(fechaPago)) {
                  fechaPagoTexto = fechaPago.toLocaleDateString('es-MX', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric' 
                  });
                }
              }
            } catch (e) {
              console.error('Error formateando fecha:', e);
            }
    
            // Formatear monto
            let montoTexto = 'ninguno';
            try {
              if (r.ultimoPago.monto !== undefined && r.ultimoPago.monto !== null) {
                montoTexto = `$${parseFloat(r.ultimoPago.monto).toLocaleString('es-MX')}`;
              }
            } catch (e) {
              console.error('Error formateando monto:', e);
            }
    
            // Obtener folio y número de pago
            const folioTexto = (r.ultimoPago.folio !== undefined && r.ultimoPago.folio !== null) 
              ? r.ultimoPago.folio.toString() 
              : 'ninguno';
    
            const numPagoTexto = (r.ultimoPago.numPago !== undefined && r.ultimoPago.numPago !== null)
              ? r.ultimoPago.numPago.toString()
              : '0';
    
            doc
              .font('Helvetica-Bold')
              .fillColor('#333')
              .text('Último pago: ', { continued: true })
              .font('Helvetica')
              .fillColor('#666')
              .text(`${fechaPagoTexto} - ${montoTexto} (Último Folio #${folioTexto})`);
            
            doc.moveDown(0.3);
    
            doc
              .font('Helvetica-Bold')
              .fillColor('#333')
              .text('Cantidad de pagos realizados: ', { continued: true })
              .font('Helvetica')
              .fillColor('#666')
              .text(numPagoTexto);
          } else {
            doc
              .font('Helvetica-Bold')
              .fillColor('#333')
              .text('Último pago: ', { continued: true })
              .font('Helvetica')
              .fillColor('#666')
              .text('ninguno');
            
            doc.moveDown(0.3);
    
            doc
              .font('Helvetica-Bold')
              .fillColor('#333')
              .text('Cantidad de pagos realizados: ', { continued: true })
              .font('Helvetica')
              .fillColor('#666')
              .text('0');
          }
    
          // Espacio entre registros (excepto después del último)
          if (index < rentasvencidas.length - 1) {
            doc.moveDown(1);
          }
        });
      }
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      doc.text('Ocurrió un error al generar el reporte', { align: 'center' });
    } finally {
      doc.end();
      
    }

    return { estatus: true };


  } catch (error) {
    return { estatus: false };
  }

}

exports.downloadContrato = async (req,res)=>{
  const idContrato = req.body;
  const  data= await generarContrato(idContrato);
  enviarContrato(data.path,data.telefono)
  res.download(data.path, 'contrato_final.pdf', (err) => {
    if (err) {
      console.error('Error al enviar el PDF:', err);
      return res.status(500).send('No se pudo enviar el PDF');
    }

    // Eliminar el PDF después de enviarlo si quieres
    
  });
}
const generarContrato = async (idContrato) => {
  const contratodb = await contratos.findOne({
    attributes: ["idContrato"],
    where: { idContrato:idContrato.idContrato },
    include: [
      {
        model: personas,
        as: "persona",
        attributes: ["nombrePersona", "apellidoPaterno", "apellidoMaterno","telefono"],
        required: true // Esto asegura que sea INNER JOIN
      }
    ],
    raw:true,
    nest: true
  });
  try {
    const datos = {
      nombre: (contratodb.persona.nombrePersona+""+contratodb.persona.apellidoPaterno+" "+ contratodb.persona.apellidoMaterno).toString().toUpperCase(),
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
    let { value: html } = await mammoth.convertToHtml({ path: tempDocxPath });
    const imageBuffer = fs.readFileSync(path.resolve(__dirname, '../uploads/templates/encabezado.png'));
    const base64Image = imageBuffer.toString('base64');
    const mimeType = 'image/png'; // Cambia si usas .jpg, .webp, etc.

    // Incrustar imagen en el HTML
    html = `
  <div style="">
    <img src="data:image/png;base64,${base64Image}" style="width: 800px;" />
  </div>
  <div style="text-align: justify;">
    ${html}
  </div>
`;
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
    return {"path":outputPdfPath,"telefono":contratodb.persona.telefono}
    
    


  } catch (error) {
    console.error('Error al generar contrato:', error);
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


const contarDepartamentos = async (estatus) => {
  try {
    const resultado = await departamentos.count({
      where: {
        estatus: estatus
      },
      col: 'numDepartamento' // Especifica la columna a contar
    });
    
    console.log(`Número de departamentos activos: ${resultado}`);
    return resultado;
  } catch (error) {
    console.error('Error al contar departamentos:', error);
    throw error;
  }
};

const enviarContrato= async (rutaArchivo,telefono) =>
{
  const sock = getSock();
  const res = await Configuracion.findOne();
  const msj = res.envioContrato;
  const fecha = new Date();
  const formatoFecha = fecha.toLocaleDateString('es-MX', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const buffer = fs.readFileSync(rutaArchivo);
  console.log(`521${telefono}@s.whatsapp.net`);
  await sock.sendMessage(`521${telefono}@s.whatsapp.net`, {
    document: buffer,
    mimetype: 'application/pdf',
    fileName: 'reporte_diario.pdf',
    caption: `Fecha: ${formatoFecha}\n\n` + msj
  });
}
