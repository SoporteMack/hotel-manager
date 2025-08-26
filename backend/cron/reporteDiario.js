const schedule = require('node-schedule');
const fs = require('fs');
require('dotenv').config();
const path = require('path');
const { getSock } = require('../utils/baileys');
const { reportediario } = require('../controllers/documentos.controller');
const configuracion = require('../models/configuracion'); // tu modelo Sequelize

const rutaArchivo = path.join(__dirname, '../uploads', 'reporte diario.pdf');

let currentJob = null;
let lastHora = null;

// Espera a que el archivo exista y su tamaño se estabilice
async function esperarArchivoListo(ruta, maxEspera = 50000, intervalo = 300) {
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

// Función para programar el cron dinámicamente
async function programarCron() {
  try {
    const config = await configuracion.findOne();
    if (!config) {
      console.error('❌ No se encontró configuración en la BD.');
      return;
    }

    const [horaStr, minutosStr] = config.horaRepDiario.split(':');

    // Convertimos a número
    const hora = parseInt(horaStr, 10);
    const minutos = parseInt(minutosStr, 10);
    if (isNaN(hora) || hora < 0 || hora > 23) {
      console.error(`❌ Hora inválida en BD: ${config.horaRepDiario}`);
      hora = 8;
    }

    // Solo reprogamar si hay un cambio en la hora
    if (hora === lastHora) return;
    lastHora = hora;

    // Cancelar el cron anterior si existe
    if (currentJob) {
      currentJob.cancel();
      console.log('🔄 Cron anterior cancelado');
    }

    console.log(`📅 Programando reporte diario a las ${hora}:00 hrs`);

    currentJob = schedule.scheduleJob({ rule: `0 ${minutos} ${hora} * * *`, tz: 'America/Mexico_City' }, async () => {
      console.log('⏰ Ejecutando cron de reporte diario');

      try {
        await reportediario();
        await esperarArchivoListo(rutaArchivo);

        const sock = getSock();
        if (!sock) {
          console.log('⏳ Sock aún no está listo');
          return;
        }

        if (!fs.existsSync(rutaArchivo)) {
          console.log('❌ Archivo no encontrado:', rutaArchivo);
          return;
        }

        const buffer = fs.readFileSync(rutaArchivo);
        await sock.sendMessage(`521${config.telefono}@s.whatsapp.net`, {
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

  } catch (error) {
    console.error('❌ Error al configurar cron:', error);
  }
}

// Revisar cada minuto si cambió la hora en BD
schedule.scheduleJob({ rule: '0 */59 * * * *', tz: 'America/Mexico_City' }, programarCron);

// Primera programación al iniciar
programarCron();
