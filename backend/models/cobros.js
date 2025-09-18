const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const Pago = require('./pagoP.js');
const  Pension =require('./pensiones.js');

const Cobros = sequelize.define('cobros', {
  idCobro: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idPension: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  periodo: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  monto: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  fechaVencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'cobros',
  timestamps: false,
});


module.exports = Cobros;