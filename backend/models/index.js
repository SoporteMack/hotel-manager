const Departamentos = require('./departamentos');
const Detalles = require('./detalle');

const models = { Departamentos, Detalles };

// Llamar a associate después de definir todos los modelos
Object.values(models).forEach(model => {
  if (model.associate) model.associate(models);
});

module.exports = models;
