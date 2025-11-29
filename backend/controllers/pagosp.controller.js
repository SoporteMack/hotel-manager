const { Cobro, Pago } = require('../models/assosiation');
const pensiones = require('../models/pensiones')
const personap = require('../models/personasP')
const { getSock } = require('../utils/baileys');
const configuracion = require("../models/configuracion");
const path = require('path')
const PDFDocument = require('pdfkit');
const fs = require('fs');
const PagosP = require('../models/pagoP');
const { Op, fn, col, where, json } = require("sequelize");
const sequelize = require('../config/database');

exports.listar = async (req, res) => {
    try {
        const response = await Pago.findAll();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
}

exports.crear = async (req, res) => {
    try {
        const { idPension, monto, fechaPago } = req.body;
        const ultimoCobro = await Cobro.findOne({
            where: { idPension:idPension, estado: 0 },
            order: [['idCobro', 'ASC']]
        });
        if (ultimoCobro.estado)
            return res.status(404).json({ mdg: "no hay cobros" });
        const data = { idCobro: ultimoCobro.idCobro, montoPagado: monto }
        const pago = await Pago.create(data);
        ultimoCobro.update({ estado: true });
        //const fecha = await nuevoCobro(idPension, ultimoCobro.monto, ultimoCobro.fechaVencimiento)
        const fecha = formatearFecha(ultimoCobro.periodo);
        const rutaArchivo = path.join(__dirname, '../uploads', 'notaP.pdf');
        await nota(pago.idPago, fecha);
        const telefono = await obtenerTelefono(idPension);
        await esperarArchivoListo(rutaArchivo)
        await enviarNota(telefono, rutaArchivo, fecha)
        const telefonoadmin = await configuracion.findOne().then(res => { return res.telefono });
        await enviarNota(telefonoadmin, rutaArchivo, fecha);
        const ultimoCobroD = await Cobro.findOne({
            where: { idPension:idPension, estado: 0 },
            order: [['idCobro', 'ASC']]
        });
        if (!ultimoCobroD) {
            await nuevoCobro(idPension, ultimoCobro.monto, ultimoCobro.fechaVencimiento)
        }
        res.status(200).json({ msg: "cobro exitoso" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "erroral cobrar" });
    }
}

const nota = async (folio, periodo) => {
    try {
        const newFecha = new Date(periodo).toLocaleDateString('es-Mx', {
            timeZone: 'America/Mexico_City',
            month: 'long',
        })
        const datos = await pension(folio);
        const dato = datos[0];
        const filePath = path.join(__dirname, '../uploads/notaP.pdf');

        // Simulación de datos
        const nota = {
            folio: folio,
            fecha: new Date().toLocaleDateString(),
            cliente: {
                nombre: `${dato.cobro.pensione.PersonaP.nombre} ${dato.cobro.pensione.PersonaP.apellido}`,
                direccion: '4 Poniente 1414, Puebla',
            },
            productos: [
                { descripcion: `ABONO RENTA Pension del mes de ${newFecha}`.toUpperCase(), cantidad: 1, precio: dato.montoPagado },
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
            .text(`Fecha de pago: ${nota.fecha}`, { align: 'right' });

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
        console.log(error);
    }

}

const pension = async (folio) => {
    const res = await Pago.findAll({
        attributes: ["montoPagado"],
        where: { idPago: folio },
        include: [
            {
                model: Cobro,
                as: "cobro",
                attributes: ["periodo"],
                include: [
                    {
                        model: pensiones,
                        as: "pensione",
                        attributes: ["precioAcordado"],
                        include: [
                            {
                                model: personap,
                                as: "PersonaP",
                                attributes: ["nombre", "apellido"]
                            }
                        ]
                    }
                ]
            }
        ],
        raw: false
    });
    return res;
}

async function esperarArchivoListo(ruta, maxEspera = 8000, intervalo = 300) {
    return new Promise((resolve, reject) => {
        const inicio = Date.now();
        let lastSize = 0;

        const check = () => {
            if (!fs.existsSync(ruta)) {
                if (Date.now() - inicio > maxEspera) {
                    return reject(new Error('Archivo no se generó a tiempo'));
                }
                return setTimeout(check, intervalo);
            }

            const stats = fs.statSync(ruta);
            if (stats.size > 0 && stats.size === lastSize) {
                return resolve();
            }

            lastSize = stats.size;
            if (Date.now() - inicio > maxEspera) {
                return reject(new Error('Archivo no se estabilizó a tiempo'));
            }

            setTimeout(check, intervalo);
        };

        check();
    });
}

const enviarNota = async (telefono, rutaArchivo, periodo) => {
    const newFecha = new Date(periodo).toLocaleDateString('es-Mx', {
        timeZone: 'America/Mexico_City',
        month: 'long',
    })
    const sock = getSock();
    const res = await configuracion.findOne();
    const msj = res.envioNotasP;
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
        fileName: 'NOTA.pdf',
        caption: `Fecha: ${formatoFecha}\n\nDel mes de: ${newFecha}\n\n` + msj
    });
};

const obtenerTelefono = async (idPension) => {
    const res = await pensiones.findAll(
        {
            attributes: ["idPension"],
            where: { idPension: idPension },
            include: [
                {
                    model: personap,
                    as: "PersonaP",
                    attributes: ["telefono"]
                }
            ]
        }
    )
    const telfono = res[0].PersonaP.telefono;
    return telfono;
}
const nuevoCobro = async (idPension, monto, fechaVencimiento) => {
    const res = await pensiones.findByPk(idPension);
    const tipoPension = res.tipoPension;
    const date = new Date(fechaVencimiento);
    const fecha = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()+2).padStart(2, '0');
    let vencimiento = new Date(date);

    if (tipoPension === "MENSUAL") {
        vencimiento.setMonth(vencimiento.getMonth() + 1);
    } else if (tipoPension === "QUINCENAL") {
        vencimiento.setDate(vencimiento.getDate() + 15);
    } else if (tipoPension === "SEMANAL") {
        vencimiento.setDate(vencimiento.getDate() + 7);
    }
    // Formatear a YYYY-MM-DD
    const year = vencimiento.getFullYear();
    const month = String(vencimiento.getMonth() + 1).padStart(2, '0');
    const day = String(vencimiento.getDate()).padStart(2, '0');
    const vencimientoFormatted = `${year}-${month}-${day}`;

    await Cobro.create({
        idPension,
        periodo: fecha,
        monto: monto,
        fechaVencimiento: vencimientoFormatted,
        estado: 0
    });
    return fecha
}

exports.listarxfecha = async (req, res) => {
    try {
        const inicio = req.query.inicio;
        const fin = req.query.fin;
        const response = await PagosP.findAll(
            {
                where: {
                    fechaPago: {
                        [Op.gte]: inicio,
                        [Op.lt]: fin
                    }
                },
                include: [
                    {
                        model: Cobro,
                        as: "cobro",
                        attributes: ["fechaVencimiento"],
                        include: [
                            {
                                model: pensiones,
                                as: "pensione",
                                attributes: ["idPension"],
                                include: [
                                    {
                                        model: personap,
                                        as: "PersonaP",
                                        attributes: ["nombre", "apellido"]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        )
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        res.statu(500).json(erro)
    }
}
exports.diferencia = async (req, res) => {
    const { idPension } = req.body
    try {

        
        const result = await sequelize.query(`
            SELECT SUM(monto) - SUM(CASE WHEN montopagado IS NULL THEN 0 ELSE montopagado END) as diferencia
            FROM pagosP as pp
            RIGHT JOIN cobros as c ON c.idCobro = pp.idCobro
            WHERE c.idPension = idPension
        `, {
            replacements: { idPension: idPension },
            type: sequelize.QueryTypes.SELECT,
            plain: true 
        });
               
        return res.status(200).json(result)

    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
}


const formatearFecha = (fecha) => {
  const d = new Date(fecha);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();
  const formattedMonth = month.length < 2 ? '0' + month : month;
  const formattedDay = day.length < 2 ? '0' + day : day;
  return [year, formattedMonth, formattedDay].join('-');
}

exports.reporteEstadoPagos = async (req, res) => {
  try {
    // Usar raw query para mayor control y mejor performance
    const resultado = await sequelize.query(`
      SELECT
        pen.idPension,
        CONCAT(per.nombre, ' ', per.apellido) AS nombre,
        -- MES ACTUAL
        MAX(
          CASE 
            WHEN MONTH(c.periodo) = MONTH(CURDATE())
             AND YEAR(c.periodo) = YEAR(CURDATE())
            THEN 
              CASE WHEN p.idPago IS NOT NULL THEN 'Pagado' ELSE 'Pendiente' END
          END
        ) AS mes_actual,

        -- MES ANTERIOR
        MAX(
          CASE 
            WHEN MONTH(c.periodo) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
             AND YEAR(c.periodo) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
            THEN 
              CASE WHEN p.idPago IS NOT NULL THEN 'Pagado' ELSE 'Pendiente' END
          END
        ) AS mes_anterior,

        -- HACE 2 MESES
        MAX(
          CASE 
            WHEN MONTH(c.periodo) = MONTH(DATE_SUB(CURDATE(), INTERVAL 2 MONTH))
             AND YEAR(c.periodo) = YEAR(DATE_SUB(CURDATE(), INTERVAL 2 MONTH))
            THEN 
              CASE WHEN p.idPago IS NOT NULL THEN 'Pagado' ELSE 'Pendiente' END
          END
        ) AS mes_2,

        -- DEUDA (ULTIMOS 3 MESES)
        COALESCE(
          SUM(
            CASE
              WHEN p.idPago IS NULL
               AND MONTH(c.periodo) BETWEEN MONTH(DATE_SUB(CURDATE(), INTERVAL 2 MONTH)) AND MONTH(CURDATE())
              THEN c.monto
              ELSE 0
            END
          ), 0
        ) AS deuda
      FROM cobros c
      INNER JOIN pensiones pen ON pen.idPension = c.idPension
      INNER JOIN personasP per ON per.idPersona = pen.idPersona
      LEFT JOIN pagosP p ON p.idCobro = c.idCobro
      GROUP BY pen.idPension, per.nombre, per.apellido;

    `, { type: sequelize.QueryTypes.SELECT });

    res.status(200).json({
      status: true,
      data: resultado,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: false, msg: 'Error al generar reporte' });
  }
};