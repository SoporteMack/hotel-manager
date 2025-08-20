const { Op, fn, col, where, json } = require("sequelize");
const contratos = require("../models/contratos");
const pagos = require("../models/pagos");
const moment = require('moment-timezone');
const personas = require("../models/personas");
const departamentos = require("../models/departamentos");


exports.listar = async (req, res) => {
  const lista = await pagos.findAll();
  res.json(lista);
};

exports.crear = async (req, res) => {
  try {
    const { monto, fechaPago, idContrato, deuda } = req.body;

    // Parsear la fecha en la zona 'America/Mexico_City'
    const [datePart, timePart] = fechaPago.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute, second] = timePart.split(':').map(Number);
    const fecha = new Date(`${year}-${month}-$${day}`)
    const response = await restardeuda(idContrato, fecha, monto, deuda);
    console.log(response)
    if (response) {
      const nuevafecha = moment.tz({
        year,
        month: month,
        day,
        hour,
        minute,
        second
      }, 'America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');

      const resultado = await pagos.findOne({
        attributes: ["numPago"],
        where: { idContrato },
        include: {
          model: contratos,
          attributes: ["estatus"],
          required: true
        },
        order: [["numPago", "DESC"]],
      });

      const siguienteNumPago = resultado ? resultado.numPago + 1 : 1;
      const estatusContrato = await contratos.findByPk(idContrato);
      const statusIdContrato = estatusContrato?.estatus ?? null;

      if (!statusIdContrato)
        return res.status(404).json({ status: false, msg: "contrato no activo" });

      const datospago = {
        numPago: siguienteNumPago,
        monto,
        fechaPago: nuevafecha,
        idContrato,
      };
      await pagos.create(datospago);

      res.status(200).json({ status: true, msg: "Pago agregado correctamente" });
    }
    else {
      res.status(500).json({ status: false, msg: "Pago no agregado correctamente" });
    }
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

    return res.status(201).json({ estatus: true, msj: "Monto y deuda actualizados correctamente" });

  } catch (error) {
    console.error('❌ Error al editar:', error);
    return res.status(501).json({ estatus: false, msj: "Error al editar" });
  }
}

exports.ingresosdeldia = async (req, res) => {
  try {
    const dia = req.query.fecha;

    if (!dia) {
      return res.status(400).json({ status: false, msg: 'Fecha requerida' });
    }

    const start = new Date(`${dia}T00:00:00.000Z`);
    const end = new Date(`${dia}T23:59:59.999Z`);

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

const restardeuda = async (idContrato, fecha, monto, deuda) => {
  try {
    const nuevafecha = new Date(fecha);
    nuevafecha.setMonth(fecha.getMonth(+1));
    const nuevadeuda = deuda - monto;
    await contratos.update({ deuda: nuevadeuda }, { where: { idContrato: idContrato } })
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}