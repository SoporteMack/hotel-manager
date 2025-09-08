const schedule = require('node-schedule');
const { getSock } = require('../utils/baileys');
const { vencetredias } = require('../controllers/contrato.controller');
const configuracion = require("../models/configuracion");


schedule.scheduleJob('35 52 15 * * *', async () => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 3);
  const fechaformateada = fromatearfecha(fecha);
  const sock = getSock(); // ✅ obtener sock actual
  if (!sock) {
    console.log('⏳ Sock aún no está listo');
    return;
  }
  const resconfig = await configuracion.findOne();
  const msj = resconfig.vencimiento3Dias;
  const res = await vencetredias(fechaformateada);
  // Helper para pausar
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  for (const contrato of res) {
    const numero = '521' + contrato['persona.telefono'];
    try {
      await sock.sendMessage(`${numero}@s.whatsapp.net`, {
        text: msj
      });
      console.log(`✅ Mensaje enviado a ${numero}`);

      // Espera 2 segundos entre cada envío
      await sleep(2000);
    } catch (err) {
      console.error('❌ Error al enviar mensaje:', err);
    }
  }
vencimiento1dia(fecha);

});
const fromatearfecha = (fecha) => {
  const fechaCompleta = new Date(fecha);
  const soloFecha = fechaCompleta.toISOString().split('T')[0];
  return soloFecha
}


const vencimiento1dia = async (fecha) => {
  const sock = getSock(); // ✅ obtener sock actual
  if (!sock) {
    console.log('⏳ Sock aún no está listo');
    return;
  }
  fecha.setDate(fecha.getDate()-2)
  const fechaformateada = fromatearfecha(fecha);
  const resconfig = await configuracion.findOne();
  const msj = resconfig.vencimiento1Dia;
  const res = await vencetredias(fechaformateada);
  // Helper para pausar
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  for (const contrato of res) {
    const numero = '521' + contrato['persona.telefono'];
    try {
      await sock.sendMessage(`${numero}@s.whatsapp.net`, {
        text: msj
      });
      console.log(`✅ Mensaje enviado a ${numero}`);

      // Espera 2 segundos entre cada envío
      await sleep(2000);
    } catch (err) {
      console.error('❌ Error al enviar mensaje:', err);
    }
  }
} 