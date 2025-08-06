const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { default: P } = require('pino');
const logStream = P.destination('./logs/baileys.log');
const logger = P({ level: 'info' }, logStream);

let sockInstance; // <-- este será el socket global

const startBot = async () => {
  const authFolder = './baileys_auth';
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    logger,
    version,
    auth: state,
    printQRInTerminal: false,
  });

  sockInstance = sock; // guardamos instancia global

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log('Escanea el siguiente código QR con tu WhatsApp:');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('⚠️ Conexión cerrada. ¿Reconectar?', shouldReconnect);
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === 'open') {
      console.log('✅ Conectado correctamente a WhatsApp');
    }
  });
};

const getSock = () => sockInstance;

module.exports = { startBot, getSock };
