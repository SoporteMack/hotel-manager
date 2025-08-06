const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const persona = sequelize.define('persona', {
    idPersona:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,
    },
    nombrePersona: {
        type:DataTypes.STRING,
        allowNull:false,
        validate:{notNull:{msg:"Nombre no puede esta vacio"},notEmpty:{msg:"Nombre no puede esta vacio"}}
    },
    apellidoPaterno: {
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull:{msg:"Apellido Paterno no puede estar vacio"},
            notEmpty:{msg:"Nombre no puede esta vacio"}            
        }
    },
    apellidoMaterno: {
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull:{msg:"Apellido Materno no puede estar vacio"},
            notEmpty:{msg:"Nombre no puede esta vacio"}
        }
    },
    telefono:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull:{msg:"Telefono no puede estar vacio"},
            notEmpty:{msg:"Nombre no puede esta vacio"}
        }
    },
    correo:{
        type:DataTypes.STRING,
    },
    estatus:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:1,
    }
},{timestamps:false});
module.exports = persona;