// controllers/pensionesController.js
const sequelize = require('../config/database');
const { Pensiones, PensionesTarifa, Tarifas, Cobro, PersonasP } = require('../models/assosiation');

exports.listarPensiones = async (req, res) => {
  try {
    const pensiones = await Pensiones.findAll({
        include: [
          {
            model: PensionesTarifa,
            as: 'tarifas',
            include: [Tarifas]
          },
          PersonasP
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
    // Crear cobros para meses anteriores si fechaInicio es menor a hoy
    const hoy = new Date();
    const fechaInicioP = new Date(req.body.fechaInicio);
    
    if (fechaInicioP < hoy) {
      let fechaActual = new Date(fechaInicioP);
      
      while (fechaActual < hoy) {
        console.log('--------------------------------------1----------------------------');
      await this.crearCobro(nuevaPension.idPension, fechaActual.toISOString().split('T')[0], precioAcordado, tipoPension, t);
      
      if (tipoPension === "MENSUAL") {
        fechaActual.setMonth(fechaActual.getMonth() + 1);
      } else if (tipoPension === "QUINCENAL") {
        fechaActual.setDate(fechaActual.getDate() + 15);
      } else if (tipoPension === "SEMANAL") {
        fechaActual.setDate(fechaActual.getDate() + 7);
      }
      }
    } else {
      await this.crearCobro(nuevaPension.idPension, fechaInicio, precioAcordado, tipoPension, t);
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
exports.crearCobro = async (idPension, fecha, monto, tipoPension, transaction) => {
  const date = new Date(fecha); // fecha inicial
  let vencimiento = new Date(date); // clonar para no modificar la original
  
  if (tipoPension === "MENSUAL") {
    vencimiento.setMonth(vencimiento.getMonth() + 1); // sumar un mes
  } else if (tipoPension === "QUINCENAL") {
    vencimiento.setDate(vencimiento.getDate() + 15); // sumar 15 días
  } else if (tipoPension === "SEMANAL") {
    vencimiento.setDate(vencimiento.getDate() + 7); // sumar 7 días
  }
  
  // Formatear a YYYY-MM-DD
  const year = vencimiento.getFullYear();
  const month = String(vencimiento.getMonth() + 1).padStart(2, '0'); // meses de 0-11
  const day = String(vencimiento.getDate()).padStart(2, '0');
  
  const vencimientoFormatted = `${year}-${month}-${day}`;
  const data = {
    idPension: idPension,
    periodo: fecha,
    monto: monto,
    fechaVencimiento: vencimientoFormatted,
    estado: 0
  };
  try {
    console.log(data);
    await Cobro.create(data, { transaction });
  } catch (error) {
    console.log(error);
    throw error;
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
    this.actualizarCobro(idPension,fechaInicio,precioAcordado,tipoPension);
    await t.commit();


    res.status(200).json({ status: true, msg: 'Pensión actualizada' });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar pensión' });
  }
};


exports.actualizarCobro = async (idPension, fecha, monto, tipoPension) => {
  // Calcular fecha de vencimiento
  const date = new Date(fecha);
  let vencimiento = new Date(date);

  if (tipoPension === "MENSUAL") {
    vencimiento.setMonth(vencimiento.getMonth() + 1);
  } else if (tipoPension === "QUINCENAL") {
    vencimiento.setDate(vencimiento.getDate() + 15);
  } else if (tipoPension === "SEMANAL") {
    vencimiento.setDate(vencimiento.getDate() + 7);
  }

  // Formatear a YYYY-MM-DD
  const year = vencimiento.getFullYear();
  const month = String(vencimiento.getMonth() + 1).padStart(2, '0');
  const day = String(vencimiento.getDate()).padStart(2, '0');
  const vencimientoFormatted = `${year}-${month}-${day}`;

  try {
    // Buscar el último cobro de esta pensión
    const ultimoCobro = await Cobro.findOne({
      where: { idPension },
      order: [['idCobro', 'DESC']]
    });

    // Si existe y su estado es 0 (pendiente), eliminarlo
    if (ultimoCobro && !ultimoCobro.estado) {
      await ultimoCobro.destroy();
    }

    // Crear el nuevo cobro
    const nuevoCobro = await Cobro.create({
      idPension,
      periodo: fecha,
      monto:monto,
      fechaVencimiento: vencimientoFormatted,
      estado: 0
    });

    return nuevoCobro;
  } catch (error) {
    console.error('Error al actualizar cobro:', error);
    throw error;
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
