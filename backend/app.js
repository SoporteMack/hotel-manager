const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const cookieParser = require('cookie-parser');
const path = require("path");
const { startBot } = require('./utils/baileys'); 
require('dotenv').config();
const fs = require('fs');
const https = require("https");

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  app.use(cors({
    origin: (origin, callback) => {
      callback(null, origin || true); // devuelve el mismo origin que llegó
    },
    credentials: true
  }));
app.use(express.json());
app.use(cookieParser());

// ⬇️ Mover todo dentro de una función async para usar await
(async () => {
  await startBot(); // ⬅️ Espera a que el bot esté listo

  require('./cron/venciminetos');
  require('./cron/reporteDiario'); 
  require('./cron/notificaciones');

  app.use('/api', require('./routes/api'));

  sequelize.sync().then(() => {
    console.log('✅ Base de datos conectada');
    const options = {
      key: fs.readFileSync(process.env.CER_KEY),
      cert: fs.readFileSync(process.env.CER),
    };
    const server = https.createServer(options, app);
    server.listen(process.env.PORT, () => {
      console.log(`App listening on https://localhost:${process.env.PORT}`);
    });
  });
})();
