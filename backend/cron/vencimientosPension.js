const schedule = require('node-schedule');
const { Cobro, Pension } = require('../models/assosiation');
const PersonaP = require('../models/personasP');
const configuracion = require("../models/configuracion");
const { getSock } = require('../utils/baileys');

schedule.scheduleJob('0 0 6 * * *', async () => {
  const fecha = new Date();
  vencimientosPension();
  fecha.setDate(fecha.getDate() + 3);

  const fechaF = fecha.getFullYear() + '-' +
    String(fecha.getMonth() + 1).padStart(2, '0') + '-' +
    String(fecha.getDate()).padStart(2, '0');

  const cob = await Cobro.findAll({
    where: { estado: 0, fechaVencimiento: fechaF }
  });

  if (!cob || cob.length === 0) return false;

  for (const c of cob) {
    console.log('Pension por vencer:', c.periodo, c.idContrato);
    const tel = await Pension.findAll({
      attributes: ["idPension"],
      where: { idPension: c.idPension },
      include: [
        {
          model: PersonaP,
          as: "PersonaP",
          attributes: ["telefono"]
        }
      ]
    });

    const pensionesLimpias = tel.map(p => p.get({ plain: true }));
    const resconfig = await configuracion.findOne();
    const msj = resconfig.vencimiento3DiasP;

    for (const p of pensionesLimpias) {
      if (p.PersonaP?.telefono) {
        console.log(p.PersonaP.telefono)
        await vencimiento3dia(msj, p.PersonaP.telefono);
      }
    }
  }
});

const vencimiento3dia = async (msg, tel) => {
  const sock = getSock(); // ✅ obtener sock actual
  if (!sock) {
    console.log('⏳ Sock aún no está listo');
    return;
  }

  // Helper para pausar
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const numero = '521' + tel;
  try {
    await sock.sendMessage(`${numero}@s.whatsapp.net`, {
      text: msg
    });
    console.log(`✅ Mensaje enviado a ${numero}`);

    // Espera 2 segundos entre cada envío
    await sleep(2000);
  } catch (err) {
    console.error('❌ Error al enviar mensaje:', err);
  }
};

const vencimientosPension = async () => {
  const fecha = new Date();
  const fechaF = fecha.getFullYear() + '-' +
    String(fecha.getMonth() + 1).padStart(2, '0') + '-' +
    String(fecha.getDate()-1).padStart(2, '0');
  const vencimientos = await Cobro.findAll({
    where: {  fechaVencimiento: fechaF }
  });
  if (!vencimientos || vencimientos.length === 0) return false;
  for (const v of vencimientos) {
    const periodo = new Date(v.periodo);
    const nuevoPeriodo = new Date(periodo.getFullYear(), periodo.getMonth() + 2, periodo.getDate()+1);
    const fechaVencimiento = new Date(v.fechaVencimiento);
    const nuevaFechaVencimiento = new Date(fechaVencimiento.getFullYear(), fechaVencimiento.getMonth() + 2, fechaVencimiento.getDate()+1);
    const monto = await Pension.findByPk(v.idPension).then(p => p.precioAcordado);
    await Cobro.create({
      idPension: v.idPension,
      periodo: formatearFecha(nuevoPeriodo),
      monto: monto,
      fechaVencimiento: formatearFecha(nuevaFechaVencimiento),
      estado: 0
    });
    console.log(`✅ Creado nuevo cobro para pension ${v.idPension} con periodo ${formatearFecha(nuevoPeriodo)}`);
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