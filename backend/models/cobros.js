const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cobro = sequelize.define("Cobro", {
    idCobro: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idPension: { type: DataTypes.INTEGER, allowNull: false },
    periodo: { type: DataTypes.STRING(20), allowNull: false },
    monto: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    fechaVencimiento: { type: DataTypes.DATEONLY, allowNull: false },
    fechaGeneracion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    estado: { type: DataTypes.STRING(20), defaultValue: "pendiente" },
    observaciones: { type: DataTypes.TEXT },
  }, {
    tableName: "cobros",
    timestamps: false,
  });
  module.exports = Cobro;