const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Configuracion = sequelize.define('configuraciones', {
    telefono: {
        type: DataTypes.STRING(15),
        allowNull: false,
        primaryKey: true, // ✅ clave primaria
        validate: {
            notNull: { msg: 'El teléfono es obligatorio' },
            notEmpty: { msg: 'El teléfono no puede estar vacío' },
            isNumeric: { msg: 'El teléfono debe contener solo números' },
            len: { args: [10, 15], msg: 'El teléfono debe tener entre 10 y 15 dígitos' }
        }
    },
    horaRepDiario: {
        type: DataTypes.TIME, // Guarda en formato HH:mm:ss en MySQL
        allowNull: false,
        validate: {
          notNull: { msg: 'La hora de reporte es obligatoria' },
          notEmpty: { msg: 'La hora de reporte no puede estar vacía' }
        },
    },
    numCuenta: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notNull: { msg: 'El número de cuenta es obligatorio' },
            notEmpty: { msg: 'El número de cuenta no puede estar vacío' },
            isNumeric: { msg: 'El número de cuenta debe contener solo números' },
            len: { args: [10, 20], msg: 'El número de cuenta debe tener entre 10 y 20 dígitos' }
        }
    },
    banco: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notNull: { msg: 'El banco es obligatorio' },
            notEmpty: { msg: 'El banco no puede estar vacío' }
        }
    },
    titular: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notNull: { msg: 'El titular es obligatorio' },
            notEmpty: { msg: 'El titular no puede estar vacío' }
        }
    },
    bienvenida:{
        type: DataTypes.TEXT(50),
        allowNull: false,
        validate: {
            notNull: { msg: 'La bienvenida es obligatorio' },
            notEmpty: { msg: 'La bienvenida no puede estar vacío' }
        }
    },
    envioNotas:{
        type: DataTypes.TEXT(50),
        allowNull: false,
        validate: {
            notNull: { msg: 'El mensaje es obligatorio' },
            notEmpty: { msg: 'El mensaje no puede estar vacío' }
        }
    },
    envioContrato:{
        type: DataTypes.TEXT(50),
        allowNull: false,
        validate: {
            notNull: { msg: 'El mensaje es obligatorio' },
            notEmpty: { msg: 'El mensaje no puede estar vacío' }
        }
    },
    vencimiento3Dias:{
        type: DataTypes.TEXT(50),
        allowNull: false,
        validate: {
            notNull: { msg: 'El mensaje es obligatorio' },
            notEmpty: { msg: 'El mensaje no puede estar vacío' }
        }
    },
    vencimiento1Dia:{
        type: DataTypes.TEXT(50),
        allowNull: false,
        validate: {
            notNull: { msg: 'El mensaje es obligatorio' },
            notEmpty: { msg: 'El mensaje no puede estar vacío' }
        }
    },
}, {
    timestamps: false,
    freezeTableName: true,
    id: false // ✅ Evita que Sequelize agregue automáticamente `id`
});

module.exports = Configuracion;
