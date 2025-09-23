const schedule = require('node-schedule');
const { Cobro, Pension } = require('../models/assosiation');
const PersonaP = require('../models/personasP');
const configuracion = require("../models/configuracion");
const { getSock } = require('../utils/baileys');

schedule.scheduleJob('0 31 11 * * *', async () => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 3);

  const fechaF = fecha.getFullYear() + '-' +
    String(fecha.getMonth() + 1).padStart(2, '0') + '-' +
    String(fecha.getDate()).padStart(2, '0');

  const cob = await Cobro.findAll({
    where: { estado: false, fechaVencimiento: fechaF }
  });

  if (!cob || cob.length === 0) return false;

  for (const c of cob) {
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
