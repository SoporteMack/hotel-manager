const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const usuario = sequelize.define('usuario',{
    usuario:{type:DataTypes.STRING,primaryKey:true,allowNull:false},
    password:DataTypes.STRING
},{timestamps:false})
module.exports = usuario;