const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const cookieParser = require('cookie-parser');
const path = require("path");
const { startBot } = require('./utils/baileys'); 
require('dotenv').config();

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ⚠️ Agrega la IP o dominio específico de tu frontend aquí
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: true,
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
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Servidor corriendo en puerto ${process.env.PORT}`)
    );
  });
})();
