const {DataTypes, NOW} = require('sequelize');
const sequelize = require('../config/database');
const contratos = require('./contratos');
const pagos = sequelize.define('pagos',{
    folio:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    numPago:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    monto:{
        type:DataTypes.FLOAT,
        allowNull:false,
        validate:{
            isFloat:{msg:'Monto de pago no es valido debe de ser numerico'}
        },
    },
    fechaPago:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue:NOW,
        validate:{
            isDate:{msg:"No es Valido la fecha"}
        }
    },
    idContrato:{
        type:DataTypes.INTEGER,
        allowNull:false,
    }
},{timestamps:false});
// Relación 1:N
contratos.hasMany(pagos, {
    foreignKey: 'idContrato',
    sourceKey: 'idContrato'
  });
  
  pagos.belongsTo(contratos, {
    foreignKey: 'idContrato',
    targetKey: 'idContrato'
  });
module.exports = pagos;