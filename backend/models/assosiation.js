// models/associations.js
const Pensiones = require('./pensiones');
const PensionesTarifa = require('./pensionesTarifas');
const Tarifas = require('./tarifas');
const PersonasP = require('./personasP');
const Cobro = require('./cobros');
const Pago = require('./pagoP');
const Pension = require('./pensiones');

// Pensiones -> Persona
Pensiones.belongsTo(PersonasP, { foreignKey: 'idPersona', onDelete: 'CASCADE' });

// Pensiones -> PensionesTarifa
Pensiones.hasMany(PensionesTarifa, { foreignKey: 'idPension', as: 'tarifas' });
PensionesTarifa.belongsTo(Pensiones, { foreignKey: 'idPension' });

// PensionesTarifa -> Tarifas
PensionesTarifa.belongsTo(Tarifas, { foreignKey: 'idTarifa' });
Cobro.hasMany(Pago, { foreignKey: 'idCobro' });
Pago.belongsTo(Cobro, { foreignKey: 'idCobro' });

Cobro.belongsTo(Pension, { foreignKey: 'idPension' });

module.exports = { Pensiones, PensionesTarifa, Tarifas, PersonasP,  Cobro,Pago, Pension };
