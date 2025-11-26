const { DataTypes, NOW } = require('sequelize');
const sequelize = require('../config/database');
const cobrosR = require('./cobrosR');

const pagos = sequelize.define('pagos', {
    folio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idCobro: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    monto: {
        type: DataTypes.FLOAT(8, 3),
        allowNull: false,
        validate: {
            isFloat: { msg: "Monto del pago no válido" }
        }
    },
    fechaPago: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: NOW,
        validate: {
            isDate: { msg: "Fecha de pago no válida" }
        }
    }
}, {
    timestamps: false,
    freezeTableName: true
});

// Relación: un cobro tiene muchos pagos
cobrosR.hasMany(pagos, {
    foreignKey: 'idCobro',
    onDelete: 'CASCADE'
});

pagos.belongsTo(cobrosR, {
    foreignKey: 'idCobro',
    onDelete: 'CASCADE'
});

module.exports = pagos;
