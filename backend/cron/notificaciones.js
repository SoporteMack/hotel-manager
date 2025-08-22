const schedule = require('node-schedule');
const { getSock } = require('../utils/baileys');
const { vencetredias } = require('../controllers/contrato.controller');


schedule.scheduleJob('0 0 10 * * *', async () => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate()+3);
  const fechaformateada = fromatearfecha(fecha);
  const sock = getSock(); // ✅ obtener sock actual
  if (!sock) {
    console.log('⏳ Sock aún no está listo');
    return;
  }
  const res = await vencetredias(fechaformateada);
  console.log(res)
  res.map(async (contrato) => {
    const numero = '521'+contrato['persona.telefono'];
    try {
      await sock.sendMessage(`${numero}@s.whatsapp.net`, {
        text: 'tu renta vence en tres dias'
      });
    } catch (err) {
      console.error('❌ Error al enviar documento:', err);
    }
  })
 
});
const fromatearfecha = (fecha) => {
  const fechaCompleta = new Date(fecha);
const soloFecha = fechaCompleta.toISOString().split('T')[0];
return soloFecha
}
