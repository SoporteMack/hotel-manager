const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const AsignacionEspacio = sequelize.define("AsignacionEspacio", {
    idAsignacion: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idPension: { type: DataTypes.INTEGER, allowNull: false },
    idEspacio: { type: DataTypes.INTEGER, allowNull: false },
    fechaAsignacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    fechaLiberacion: { type: DataTypes.DATE },
    estado: { type: DataTypes.STRING(20), defaultValue: "activa" },
  }, {
    tableName: "asignacion_espacios",
    timestamps: false,
  });
  module.exports = AsignacionEspacio;