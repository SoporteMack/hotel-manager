const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Carro = sequelize.define("Carro", {
    idCarro: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idPersona: { type: DataTypes.INTEGER, allowNull: false },
    placa: { type: DataTypes.STRING(10), allowNull: false, unique: true },
    marca: { type: DataTypes.STRING(50), allowNull: false },
    modelo: { type: DataTypes.STRING(50) },
    anio: { type: DataTypes.INTEGER },
    color: { type: DataTypes.STRING(30) },
    tipoVehiculo: { type: DataTypes.STRING(30), defaultValue: "sedan" },
    estado: { type: DataTypes.STRING(20), defaultValue: "activo" },
    observaciones: { type: DataTypes.TEXT },
  }, {
    tableName: "carros",
    timestamps: false,
  });
module.exports = Carro;