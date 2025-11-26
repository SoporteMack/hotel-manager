const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const contratos = require('./contratos');

const cobrosR = sequelize.define('cobrosR', {
    idCobro: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idContrato: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    periodo: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: { msg: "Monto no es válido" }
        }
    },
    fechaVencimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: { msg: "Fecha de vencimiento no válida" }
        }
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    }
}, {
    timestamps: false,
    freezeTableName: true
});

// Relación: contrato tiene muchos cobros
contratos.hasMany(cobrosR, {
    foreignKey: 'idContrato',
    onDelete: 'CASCADE'
});

cobrosR.belongsTo(contratos, {
    foreignKey: 'idContrato',
    onDelete: 'CASCADE'
});

module.exports = cobrosR;
