// controllers/pensionesController.js
const sequelize = require('../config/database');
const { Pensiones, PensionesTarifa, Tarifas } = require('../models/assosiation');

exports.listarPensiones = async (req, res) => {
  try {
    const pensiones = await Pensiones.findAll({
        include: [
          {
            model: PensionesTarifa,
            as: 'tarifas',
            include: [Tarifas]
          }
        ]
      });
    res.status(200).json(pensiones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al listar pensiones' });
  }
};

// Crear pensión con tarifas
exports.crearPension = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { idPersona, fechaInicio, precioAcordado, estado, observaciones,llave, tarifas,tipoPension } = req.body;

    const nuevaPension = await Pensiones.create(
      { idPersona, fechaInicio, precioAcordado, estado, observaciones, llave, tipoPension},
      { transaction: t }
    );

    if (tarifas && tarifas.length > 0) {
      const registros = tarifas.map(tarifa => ({
        idPension: nuevaPension.idPension,
        idTarifa: tarifa.idTarifa,
        cantidad: tarifa.cantidad
      }));
      await PensionesTarifa.bulkCreate(registros, { transaction: t });
    }

    await t.commit();

    // Devolver pensión con tarifas asociadas
    const pensionCompleta = await Pensiones.findByPk(nuevaPension.idPension, {
      include: { model: PensionesTarifa, as: 'tarifas', include: [Tarifas] }
    });

    res.status(201).json({ status: true, msg: 'Pensión creada', data: pensionCompleta });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: 'Error al crear pensión' });
  }
};

// Actualizar pensión y tarifas
exports.actualizarPension = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { idPension,idPersona, fechaInicio, precioAcordado, estado, observaciones,llave, tarifas,tipoPension } = req.body;

    await Pensiones.update({ fechaInicio, precioAcordado, estado, observaciones,idPersona,llave,tipoPension}, { where: { idPension }, transaction: t });

    if (tarifas && Array.isArray(tarifas)) {
      // eliminar asociaciones existentes
      await PensionesTarifa.destroy({ where: { idPension }, transaction: t });

      // crear nuevas asociaciones
      const registros = tarifas.map(tarifa => ({ idPension, idTarifa: tarifa.idTarifa, cantidad: tarifa.cantidad }));
      await PensionesTarifa.bulkCreate(registros, { transaction: t });
    }

    await t.commit();


    res.status(200).json({ status: true, msg: 'Pensión actualizada' });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar pensión' });
  }
};

// Eliminar pensión
exports.eliminarPension = async (req, res) => {
  try {
    const { idPension } = req.params;
    await Pensiones.destroy({ where: { idPension } });
    res.status(200).json({ status: true, msg: 'Pensión eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar pensión' });
  }
};

// Asociar tarifas a pensión (solo tarifas)
exports.asociarTarifas = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { idPension } = req.params;
    const { tarifas } = req.body; // [{idTarifa, cantidad}, ...]

    await PensionesTarifa.destroy({ where: { idPension }, transaction: t });

    const registros = tarifas.map(tarifa => ({ idPension, idTarifa: tarifa.idTarifa, cantidad: tarifa.cantidad }));
    await PensionesTarifa.bulkCreate(registros, { transaction: t });

    await t.commit();

    const pensionConTarifas = await Pensiones.findByPk(idPension, {
      include: { model: PensionesTarifa, as: 'tarifas', include: [Tarifas] }
    });

    res.status(200).json({ status: true, msg: 'Tarifas asociadas a la pensión', data: pensionConTarifas });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: 'Error al asociar tarifas' });
  }
};
