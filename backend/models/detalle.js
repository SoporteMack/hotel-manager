const { DataTypes, DATE } = require('sequelize');
const sequelize = require('../config/database');
const departamentos = require('./departamentos');

const detalles = sequelize.define('detalles',{
    idDetalle:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    descripcion:
    {
        type:DataTypes.STRING,
        allowNull:false
    }
},
{
    timestamps:false
})
detalles.associate = (models) => {
detalles.belongsToMany(models.Departamentos,{
    through:'departamentosDetalle',
    foreignKey:'idDetalle',
    otherKey:'numDepartamento',
    timestamps:false
})
};

module.exports = detalles;