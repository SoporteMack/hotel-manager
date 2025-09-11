const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const PersonaP = sequelize.define("PersonaP", {
    idPersona: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    apellido: { type: DataTypes.STRING(100), allowNull: false },
    telefono: { type: DataTypes.STRING(20) },
    observaciones: { type: DataTypes.TEXT },
    INE:{type:DataTypes.STRING}
  }, {
    tableName: "personasP",
    timestamps: false,
  });
  module.exports = PersonaP;