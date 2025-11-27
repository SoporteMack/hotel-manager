const { Op, fn, col, where, json } = require("sequelize");
const contratos = require("../models/contratos");
const pagos = require("../models/pagos");
const moment = require('moment-timezone');
const personas = require("../models/personas");
const departamentos = require("../models/departamentos");
const configuracion = require("../models/configuracion");
const path = require('path')
const { nota } = require("./documentos.controller");
const { getSock } = require('../utils/baileys');
const fs = require('fs');
const sequelize = require("../config/database");
const cobrosR = require("../models/cobrosR");


exports.listar = async (req, res) => {
  const lista = await pagos.findAll();
  res.json(lista);
};

exports.crear = async (req, res) => {
  try {
    const { monto, fechaPago, idContrato, deuda } = req.body
    const fecha = formatearFecha(new Date(fechaPago));
    let datoscobro = await cobrosR.findOne({
      where: { idContrato: idContrato, estado: 0 },
      order: [['idCobro', 'ASC']],
      raw: true
    });
    if (!datoscobro) {
      await crearCobro(idContrato);
      datoscobro = await cobrosR.findOne({
      where: { idContrato: idContrato, estado: 0 },
      order: [['idCobro', 'ASC']],
      raw: true
    });
    }
    const precioDepa = await findCostoDepa(idContrato);
    const idCobro = datoscobro.idCobro;
    
    await cobrosR.update({ estado: 1 }, { where: { idCobro: idCobro } });
    const dataspago = {
      monto: monto,
      fechaPago: fecha,
      idCobro: idCobro,
    };
    const pago = await pagos.create(dataspago);
    const foliopago = pago.folio;
    const rutaArchivo = path.join(__dirname, '../uploads', 'nota.pdf');
    const inicio = new Date(datoscobro.periodo).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
    const fin = new Date(datoscobro.fechaVencimiento).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
    const mesC = `${inicio} al ${fin}`;
    console.log(mesC);
    await nota(foliopago, mesC);
    const telefono = await obtenerTelefono(idContrato);
    await esperarArchivoListo(rutaArchivo)
    await enviarNota(telefono, rutaArchivo, mesC)
    const telefonoadmin = await configuracion.findOne().then(res => { return res.telefono });
    await enviarNota(telefonoadmin, rutaArchivo, mesC)
    await restardeuda(idContrato, fechaPago, monto, deuda);
    //await cobrosR.create({ idContrato: idContrato, periodo: formatearFecha(nuevaFechaInicio), monto: precioDepa, fechaVencimiento: formatearFecha(nuevaFechaVencimiento), estado: 0 })
    res.status(200).json({ status: true, msg: "Pago agregado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: false, msg: "Pago no agregado" });
  }
};

exports.editar = async (req, res) => {
  try {
    const { monto, folio } = req.body;
    const pago = await pagos.findByPk(folio);

    if (!pago) {
      return res.status(404).json({ estatus: false, msj: "Pago no encontrado" });
    }

    const idContrato = pago.idContrato;
    const montoActual = pago.monto;
    const diferencia = montoActual - monto; // si aumentas el monto, aumenta la deuda
    const contrato = await contratos.findOne({
      attributes: ["deuda"],
      where: { idContrato: idContrato }
    });

    if (!contrato) {
      return res.status(404).json({ estatus: false, msj: "Contrato no encontrado" });
    }

    const nuevaDeuda = parseFloat(contrato.deuda) + parseFloat(diferencia);
    //res.json(nuevaDeuda)
    // Actualiza el monto del pago
    await pagos.update({ monto: monto }, { where: { folio: folio } });

    // Actualiza la deuda del contrato
    await contratos.update({ deuda: nuevaDeuda }, { where: { idContrato: idContrato } });
    await nota(folio);
    const rutaArchivo = path.join(__dirname, '../uploads', 'nota.pdf');
    const telefono = await obtenerTelefono(idContrato);
    await enviarNota(telefono, rutaArchivo);
    await enviarmsg(idContrato, folio);
    const telefonoadmin = await configuracion.findOne().then(res => { return res.telefono });
    await enviarNota(telefonoadmin, rutaArchivo);
    return res.status(201).json({ estatus: true, msj: "Monto y deuda actualizados correctamente" });

  } catch (error) {
    console.error('❌ Error al editar:', error);
    return res.status(501).json({ estatus: false, msj: "Error al editar" });
  }
}

exports.ingresosdeldia = async (req, res) => {
  try {
    const dia = req.query.fechaInicio;
    const dia2 = req.query.fechaFinal;

    if (!dia) {
      return res.status(400).json({ status: false, msg: 'Fecha requerida' });
    }

    const start = new Date(dia);
    start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dia2);
    end.setHours(23, 59, 59, 59);
    end.setDate(end.getDate() + 1)
    const resultado = await pagos.findOne({
      attributes: [[fn('SUM', col('monto')), 'pagos']],
      where: {
        fechaPago: {
          [Op.between]: [start, end],
        },
      },
      raw: true,
    });

    const monto = parseFloat(resultado.pagos || 0);

    // 🔢 Formatear el número con comas y dos decimales
    const montoFormateado = new Intl.NumberFormat('es-MX', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(monto);

    res.status(200).json({
      status: true,
      msg: 'Éxito',
      monto: montoFormateado
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      msg: 'Error al calcular'
    });
  }
};

exports.listarpagosporfecha = async (req, res) => {
  try {
    const inicio = moment.tz(req.query.inicio, 'America/Mexico_City').startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const fin = moment.tz(req.query.fin, 'America/Mexico_City').endOf('day').format('YYYY-MM-DD HH:mm:ss');
    const lista = await pagos.findAll({
      attributes: ["folio", "numPago", "monto", "fechaPago"],
      where: {
        fechaPago: {
          [Op.gte]: inicio,
          [Op.lt]: fin
        }
      },
      include: [{
        model: contratos,
        attributes: ["idcontrato", "deuda"],
        as: "contrato",
        include: [{
          model: personas,
          attributes: ["nombrePersona", "apellidoPaterno", "apellidoMaterno"],
          as: "persona"
        },
        {
          model: departamentos,
          as: "departamento",
          attributes: ["descripcion"]
        }
        ]
      }]
    });

    return res.status(200).json({ inicio, fin, lista });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener datos" });
  }


}

exports.listarpagoporpersona = async (req, res) => {
  try {
    const nombre = req.query.nombre;
    const apellidoP = req.query.apellidoP;
    const apellidoM = req.query.apellidoM;
    const lista = await pagos.findAll({
      attributes: ["folio", "numPago", "monto", "fechaPago"],
      include: [{
        model: contratos,
        attributes: ["idContrato"],
        as: "contrato",
        where: { estatus: true },
        include: [{
          model: personas,
          attributes: ["nombrePersona", "apellidoPaterno", "apellidoMaterno"],
          as: "persona",
          where: {
            [Op.or]: [
              nombre ? { nombrePersona: { [Op.like]: `%${nombre}%` } } : {},
              apellidoP ? { apellidoPaterno: { [Op.like]: `%${apellidoP}%` } } : {},
              apellidoM ? { apellidoMaterno: { [Op.like]: `%${apellidoM}%` } } : {},
            ]
          }
        }]
      }]
    });

    return res.status(200).json({ lista })
  } catch (e) {
    return res.status(500).json({ error: e })
  }

}


exports.obtenerUltimos5IngresosDelDia = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // inicio del día
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1); // inicio del siguiente día

    const ultimos5 = await pagos.findAll({
      where: {
        fechaPago: {
          [Op.gte]: hoy,
          [Op.lt]: manana
        }
      },
      order: [['fechaPago', 'DESC']], // más recientes primero
      include: [
        {
          model: contratos,
          as: "contrato",
          attributes: ['idContrato'],
          include: [{
            model: personas,
            as: "persona",
            attributes: ["nombrePersona", "apellidoPaterno", "apellidoMaterno"]
          },
          {
            model: departamentos,
            as: "departamento",
            attributes: ['descripcion']
          }]
        }
      ]
    });
    const ultimos5Formateados = ultimos5.map(pago => ({
      ...pago.toJSON(), // si no estás usando raw: true
      fechaPago: pago.fechaPago.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })
    }));

    return res.status(200).json(ultimos5Formateados);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "errro al obtner los datos" });
  }
};

const restardeuda = async (idContrato, _fecha, _monto, _deuda) => {
  try {
    // Sumar todos los 'monto' de cobrosR para este contrato
    const totalCobrosRes = await cobrosR.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('monto')), 'totalCobros']],
      where: { idContrato },
      raw: true
    });
    const totalCobros = parseFloat(totalCobrosRes?.totalCobros) || 0;

    // Obtener todos los idCobro relacionados al contrato
    const cobrosList = await cobrosR.findAll({ attributes: ['idCobro'], where: { idContrato }, raw: true });
    const cobrosIds = cobrosList.map(c => c.idCobro).filter(Boolean);

    // Sumar todos los pagos (campo 'monto') asociados a esos idCobro
    let totalPagos = 0;
    if (cobrosIds.length > 0) {
      const pagosRes = await pagos.findOne({
        attributes: [[sequelize.fn('SUM', sequelize.col('monto')), 'totalPagos']],
        where: { idCobro: { [Op.in]: cobrosIds } },
        raw: true
      });
      totalPagos = parseFloat(pagosRes?.totalPagos) || 0;
    }

    // Nueva deuda = suma de cobros - suma de pagos
    const nuevaDeuda = totalCobros - totalPagos;

    await contratos.update({ deuda: nuevaDeuda }, { where: { idContrato } });
    return true;
  } catch (error) {
    console.error('Error en restardeuda:', error);
    return false;
  }
}

const obtenerTelefono = async (idContrato) => {
  const res = await contratos.findOne({
    attributes: ['idContrato'],
    where: { idContrato: idContrato },
    include: [{
      model: personas,
      as: 'persona',
      attributes: ['telefono']
    }],
    raw: true
  })
  return res['persona.telefono'];
}

const enviarNota = async (telefono, rutaArchivo, mes) => {
  const sock = getSock();
  const res = await configuracion.findOne();
  const msj = res.envioNotas;
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
    caption: `Fecha: ${formatoFecha}\n\nDel mes de ${mes}\n\n` + msj
  });
};


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
const enviarmsg = async (idContrato, folio) => {
  const sock = getSock();
  const res = await contratos.findOne({
    attributes: ["idContrato"],
    where: { idContrato: idContrato },
    include: [{
      model: personas,
      as: "persona",
      attributes: ["nombrePersona", "apellidoPaterno", "apellidoMaterno"]
    }]
  }).then(res => { return res.persona })

  const telefono = await configuracion.findOne().then(res => { return res.telefono });
  const nom = res.nombrePersona + " " + res.apellidoPaterno + " " + res.apellidoMaterno;
  const msj = "se actulizo pago de folio " + folio + "\n de la persona " + nom
  const numero = '521' + telefono;
  try {
    await sock.sendMessage(`${numero}@s.whatsapp.net`, {
      text: msj
    });
    console.log(`✅ Mensaje enviado a ${numero}`);

  } catch (err) {
    console.error('❌ Error al enviar mensaje:', err);
  }
}

const mesContrato = async (idContrato) => {
  const totalnumpagos = await pagos.findAll({
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('numPago')), 'numPagos']
    ],
    where: { idContrato: idContrato },
    raw: true
  })
  const fechaContrato = await contratos.findOne(
    {
      attributes: ['fechaInicio'],
      where: { idContrato: idContrato },
      raw: true
    }
  )
  console.log(totalnumpagos[0]['numPagos'])
  const date = new Date(fechaContrato['fechaInicio']);
  const nuevafecha = new Date(new Date(fechaContrato['fechaInicio']).setMonth(date.getMonth() + totalnumpagos[0]['numPagos']));
  const newDate = nuevafecha.toLocaleDateString('es-Mx', {
    timeZone: 'America/Mexico_City',
    month: 'long',
  })
  return newDate
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
const findCostoDepa = async (idContrato) => {
    const contrato = await contratos.findByPk(idContrato);
    const departamento = await departamentos.findByPk(contrato.numDepartamento);
    return departamento.costo;
}

const crearCobro = async (idContrato) => 
  {
    const precioDepa = await findCostoDepa(idContrato);
    const datoscobro = await cobrosR.findOne({
      where: { idContrato: idContrato, estado: 1 },
      order: [['idCobro', 'DESC']],
      raw: true
    });
    const periodo = datoscobro ? new Date(datoscobro.fechaVencimiento) : new Date();
    periodo.setDate(periodo.getDate() + 2);
    const nuevoPeriodo = formatearFecha(periodo);
    periodo.setMonth(periodo.getMonth() + 1);
    periodo.setDate(periodo.getDate() -1);
    const nuevoaFechaVencimiento = formatearFecha(periodo);
    const data =
    {
      idContrato: idContrato,
      periodo:nuevoPeriodo,
      monto: precioDepa,
      fechaVencimiento: nuevoaFechaVencimiento, 
      estado: 0,
    }
    await cobrosR.create(data);
  }