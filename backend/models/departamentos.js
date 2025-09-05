const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const detalles = require('./detalle');
const departamentos = sequelize.define('departamentos',{
    numDepartamento:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        unique:true,
        autoIncrement:true
    },
    descripcion:
    {
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull:{msg:'Descripcion de valido'},
            notEmpty:{msg:'Descripcion de departamento de valido'},
        }
    },

    costo:{
        type:DataTypes.FLOAT,
        allowNull:false,
        validate:{
            isFloat:{msg:'Costo no valido debe de ser numerico'}
        }
    },
    estatus:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
    }
},{
    timestamps:false
})

departamentos.associate = (models) => {
    departamentos.belongsToMany(models.Detalles, {
      through: 'departamentosDetalle',
      foreignKey: 'numDepartamento',
      otherKey: 'idDetalle',
      timestamps: false
    });
  };
module.exports = departamentos;