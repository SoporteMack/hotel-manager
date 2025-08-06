const schedule = require('node-schedule');
const fs = require('fs');
require('dotenv').config();
const path = require('path');
const { getSock } = require('../utils/baileys'); // ✅ Usamos getSock
const {reportediario} = require('../controllers/documentos.controller');

const numero = '5212381567091'; 
const rutaArchivo = path.join(__dirname, '../uploads', 'reporte diario.pdf');

schedule.scheduleJob('59 59 23 * * *', async () => {
  const reporte = await reportediario();

  const sock = getSock(); // ✅ obtener sock actual

  if (!sock) {
    console.log('⏳ Sock aún no está listo');
    return;
  }

  try {
    if (!fs.existsSync(rutaArchivo)) {
      console.log('❌ Archivo no encontrado:', rutaArchivo);
      return;
    }

    const buffer = fs.readFileSync(rutaArchivo);

    await sock.sendMessage(`${numero}@s.whatsapp.net`, {
      document: buffer,
      mimetype: 'application/pdf',
      fileName: 'reporte_diario.pdf',
      caption: '📄 Aquí está el reporte diario.'
    });

    console.log('✅ Documento enviado correctamente');
  } catch (err) {
    console.error('❌ Error al enviar documento:', err);
  }
});
