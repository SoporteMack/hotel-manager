const { DataTypes, DATE } = require('sequelize');
const sequelize = require('../config/database');

// Importa los modelos relacionados
const persona = require('./personas');
const departamento = require('./departamentos');
const proximoMes = () => {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = hoy.getMonth() + 1; // siguiente mes (0-indexado)
  const dia = hoy.getDate();
  const fecha = new Date(anio, mes, dia); // día 1 del próximo mes
  console.log(fecha)
  return fecha.toISOString().slice(0, 10); // formato 'YYYY-MM-DD'
};

// Definición del modelo
const contratos = sequelize.define('contratos', {
  idContrato: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  idPersona: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  numDepartamento: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  deposito:{
    type:DataTypes.DECIMAL,
    defaultValue:0
  },
  deuda:{
    type:DataTypes.DECIMAL,
    defaultValue:0
  },
  fechaPago:{
    type:DataTypes.DATEONLY,
  },
  fechaInicio: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    validate: {
      isDate: { msg: "fecha de Inicio de contrato no valida" }
    }
  },
  fechaTermino: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: { msg: "fecha de Término de contrato no valida" }
    }
  },
  INED: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "El INE no debe de estar vacío" }
    }
  },INEA: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "El INE no debe de estar vacío" }
    }
  },
  comprobanteDeDomicilio: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tarjetaD: {
    type: DataTypes.STRING,
    allowNull:true
  }, 
  tarjetaA: {
    type: DataTypes.STRING,
    allowNull:true
  },
  docContrato: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: { msg: "El contrato no debe de estar vacío" }
    }
  }
}, {
  timestamps: false
});

contratos.beforeCreate((contrato, options) => {
  if (contrato.fechaInicio) {
    const inicio = new Date(contrato.fechaInicio);
    const hoy = new Date();
    const band = inicio.getDate()<hoy.getDate();
    const anio = inicio.getFullYear();
    const mes = band?hoy.getMonth() + 1:inicio.getMonth() +1; // siguiente mes
    const dia = inicio.getDate() +1;

    const fechaProxima = new Date(anio, mes, dia); // mismo día, próximo mes
    console.log("a",fechaProxima)
    contrato.fechaPago = fechaProxima.toISOString().slice(0, 10); // YYYY-MM-DD
  }
});


// Una persona tiene muchos contratos
persona.hasMany(contratos, {
  foreignKey: 'idPersona',
  as: 'contratos'
});
contratos.belongsTo(persona, {
  foreignKey: 'idPersona',
  as: 'persona'
});

// Un departamento tiene muchos contratos
departamento.hasMany(contratos, {
  foreignKey: 'numDepartamento',
  as: 'contratos'
});
contratos.belongsTo(departamento, {
  foreignKey: 'numDepartamento',
  as: 'departamento'
});

module.exports = contratos;
