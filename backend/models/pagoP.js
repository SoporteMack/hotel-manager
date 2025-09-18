const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const  Cobro = require ('./cobros.js');

const PagosP = sequelize.define('pagoP', {
  idPago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idCobro: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  montoPagado: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  fechaPago: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'pagosP',
  timestamps: false,
});


module.exports = PagosP;
