const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pension = sequelize.define("Pension", {
    idPension: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idCarro: { type: DataTypes.INTEGER, allowNull: false },
    idTarifa: { type: DataTypes.INTEGER, allowNull: false },
    fechaInicio: { type: DataTypes.DATEONLY, allowNull: false },
    fechaFin: { type: DataTypes.DATEONLY },
    precioAcordado: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    estado: { type: DataTypes.STRING(20), defaultValue: "activa" },
    observaciones: { type: DataTypes.TEXT },
  }, {
    tableName: "pensiones",
    timestamps: false,
  });
  module.exports = Pension;