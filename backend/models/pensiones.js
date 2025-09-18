// models/pensiones.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Cobros } = require('./cobros');

const Pensiones = sequelize.define('pensiones', {
  idPension: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  idPersona: { type: DataTypes.INTEGER, allowNull: false },
  fechaInicio: { type: DataTypes.DATEONLY, allowNull: false },
  precioAcordado: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  estado: { type: DataTypes.BOOLEAN, defaultValue: true },
  observaciones: { type: DataTypes.TEXT },
  llave:{type:DataTypes.BOOLEAN,defaultValue:false},
  tipoPension:{type:DataTypes.STRING(50),allowNull:false,defaultValue:"MENSUAL"}
}, { timestamps: false });

module.exports = Pensiones;
