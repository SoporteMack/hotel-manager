// models/associations.js
const Pensiones = require('./pensiones');
const PensionesTarifa = require('./pensionesTarifas');
const Tarifas = require('./tarifas');
const PersonasP = require('./personasP');

// Pensiones -> Persona
Pensiones.belongsTo(PersonasP, { foreignKey: 'idPersona', onDelete: 'CASCADE' });

// Pensiones -> PensionesTarifa
Pensiones.hasMany(PensionesTarifa, { foreignKey: 'idPension', as: 'tarifas' });
PensionesTarifa.belongsTo(Pensiones, { foreignKey: 'idPension' });

// PensionesTarifa -> Tarifas
PensionesTarifa.belongsTo(Tarifas, { foreignKey: 'idTarifa' });

module.exports = { Pensiones, PensionesTarifa, Tarifas, PersonasP };
