const schedule = require('node-schedule');
const pagos = require('../models/pagos');
const contratos = require('../models/contratos');
const departamentos = require('../models/departamentos');
const { Op} = require('sequelize');
const sequelize = require('sequelize')
const cobrosR = require('../models/cobrosR');

schedule.scheduleJob('0 25 11 * * *', async () => {
    const hoy = formatearFecha(new Date());
    const fechaAnterior = new Date(hoy);
    const diaAnterior = formatearFecha(fechaAnterior);
    const vencimeintosAyer = await cobrosR.findAll({ where: { fechaVencimiento: diaAnterior, estado: 0 } });
    vencimeintosAyer.map(async (item) => {
        try {
            const costoDepa = await findCostoDepa(item.idContrato);
            const fecha = new Date(item.fechaVencimiento);
            const fechaPeriodo = new Date(item.periodo);
            fechaPeriodo.setMonth(fechaPeriodo.getMonth() + 1);
            fechaPeriodo.setDate(fechaPeriodo.getDate()+1);
            const nuevoPeriodo = formatearFecha(fechaPeriodo)
            fecha.setMonth(fecha.getMonth() + 1);
            fecha.setDate(fecha.getDate()+1);
            const nuevaFechaVencimiento = formatearFecha(fecha);
            console.log(nuevaFechaVencimiento);
            const data = {
                idContrato: item.idContrato,
                periodo: nuevoPeriodo,
                monto:costoDepa,
                fechaVencimiento: nuevaFechaVencimiento,
                estado: 0
            };
            await cobrosR.create(data);
            await restardeuda(item.idContrato, nuevaFechaVencimiento, costoDepa, null);
        }
        catch (error) {
            console.log('Error al aumentar interes por retraso en pago para contrato:', item.idContrato, error);
        }
    });

});

const findCostoDepa = async (idContrato) => {
    const contrato = await contratos.findByPk(idContrato);
    const departamento = await departamentos.findByPk(contrato.numDepartamento);
    return departamento.costo;
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
