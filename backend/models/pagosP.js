const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const PagoP = sequelize.define("Pago", {
    idPago: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idCobro: { type: DataTypes.INTEGER, allowNull: false },
    montoPagado: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    metodoPago: { type: DataTypes.STRING(30), allowNull: false },
    fechaPago: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    referencia: { type: DataTypes.STRING(100) },
    recibido_por: { type: DataTypes.STRING(100) },
    observaciones: { type: DataTypes.TEXT },
  }, {
    tableName: "pagosP",
    timestamps: false,
  });

  module.exports =  PagoP;