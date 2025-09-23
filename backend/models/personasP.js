const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const PersonaP = sequelize.define("PersonaP", {
    idPersona: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    apellido: { type: DataTypes.STRING(100), allowNull: false },
    telefono: { type: DataTypes.STRING(20) },
    telefono2:{type:DataTypes.STRING(20),allowNull:false},
    observaciones: { type: DataTypes.TEXT },
    INE:{type:DataTypes.STRING},
    comprobanteDeDomicilio:{type:DataTypes.STRING}
  }, {
    tableName: "personasP",
    timestamps: false,
  });
  module.exports = PersonaP;