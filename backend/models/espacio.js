const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Espacio = sequelize.define("Espacio", {
    idEspacio: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    numeroEspacio: { type: DataTypes.STRING(10), allowNull: false, unique: true },
    tipoEspacio: { type: DataTypes.STRING(30), defaultValue: "descubierto" },
    estado: { type: DataTypes.STRING(30), defaultValue: "disponible" },
    observaciones: { type: DataTypes.TEXT },
  }, {
    tableName: "espacios",
    timestamps: false,
  });
  module.exports = Espacio;