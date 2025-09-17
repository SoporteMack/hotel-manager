// models/pensionesTarifa.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PensionesTarifa = sequelize.define('pensionesTarifa', {
  idPension: { type: DataTypes.INTEGER, primaryKey: true },
  idTarifa: { type: DataTypes.INTEGER, primaryKey: true },
  cantidad: { type: DataTypes.INTEGER, allowNull: false }
}, { timestamps: false });

module.exports = PensionesTarifa;
