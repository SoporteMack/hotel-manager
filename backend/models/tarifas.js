const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const tarifas = sequelize.define("tarifas", {
    idTarifa: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    precio: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: false },
    estado:{type:DataTypes.BOOLEAN,allowNull:false,defaultValue:1}
  }, {
    timestamps: false,
  });
  module.exports = tarifas;