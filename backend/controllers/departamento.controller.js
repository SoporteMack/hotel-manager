const departamentos = require("../models/departamentos");
const { Departamentos, Detalles } = require('../models');

exports.listar = async (req, res) => {
  try {
    const lista = await Departamentos.findAll({
      include: {
        model: Detalles,
        through: { attributes: [] } // oculta los campos de la tabla puente
      }
    });
    res.json(lista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al listar departamentos' });
  }
};
exports.crear = async (req, res) => {
  const { descripcion, costo, estatus, detalles } = req.body;

  try {
    // Crear departamento
    const departamentobd = await Departamentos.create({ descripcion, costo, estatus });

    // Asociar detalles usando los IDs
    if (Array.isArray(detalles) && detalles.length > 0) {
      await departamentobd.addDetalles(detalles); // ⚡ Ahora funciona
    }

    res.status(200).json({ status: true, msg: "Departamento agregado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, msg: "Error al crear departamento", error });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const numDep = req.params.numDep;
    const { descripcion, costo, estatus, detalles } = req.body; 
    
    const depfind = await Departamentos.findByPk(numDep);
    if (!depfind)
      return res
        .status(404)
        .json({ status: false, msg: "Número de departamento no encontrado" });

    
    await depfind.update({ descripcion, costo, estatus });

    
    if (Array.isArray(detalles)) {
      await depfind.setDetalles(detalles);
    }

    res
      .status(200)
      .json({ status: true, msg: "Datos de departamento actualizados correctamente" });

  } catch (e) {
    if (e.name === "SequelizeValidationError") {
      const errores = e.errors.map((err) => ({
        campo: err.path,
        mensaje: err.message,
      }));
      return res.status(400).json({ status: false, errores });
    }

    console.error(e);
    res.status(500).json({
      status: false,
      mensaje: "Error al actualizar datos de departamento",
    });
  }
};



exports.listarActivos = async (req, res) => {
  try {
    const lista = await departamentos.findAll({
      attributes: ["numDepartamento", "descripcion", "costo"],
      where: {
        estatus: true
      }
    })
    res.status(200).json({ status: true, lista: lista })
  } catch (e) {
    console.log(e)
    res.status(500).json({ status: false, msg: "error al cargar departamentos" })
  }

}

exports.listarActivosyActual = async (req, res) => {
  const actual = req.query.numDepartamento;
  try {
    const lista = await departamentos.findAll({
      attributes: ["numDepartamento", "descripcion"],
      where: {
        estatus: true,
      }
    })
    const depactual = await departamentos.findOne({ where: { numDepartamento: actual } })
    const nuevaLista = lista.concat(depactual);
    res.status(200).json({ status: true, lista: nuevaLista })
  } catch (e) {
    console.log(e)
    res.status(500).json({ status: false, msg: "error al cargar departamentos" })
  }
}