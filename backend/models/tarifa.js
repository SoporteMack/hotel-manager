const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Tarifa = sequelize.define("Tarifa", {
    idTarifa: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tipoVehiculo: { type: DataTypes.STRING(30), allowNull: false },
    tipoPension: { type: DataTypes.STRING(20), allowNull: false },
    precio: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    descripcion: { type: DataTypes.TEXT },
    estado: { type: DataTypes.STRING(20), defaultValue: "activo" },
  }, {
    tableName: "tarifas",
    timestamps: false,
  });
module.exports = Tarifa;