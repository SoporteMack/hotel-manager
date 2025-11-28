const {Cobro,Pago} = require('../models/assosiation');
// Crear un cobro
exports.crear = async (req, res) => {
  try {
    const cobro = await Cobro.create(req.body);
    res.status(201).json(cobro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los cobros
exports.listar = async (req, res) => {
  try {
    const cobros = await Cobro.findAll({
      include: { model: Pago }
    });
    res.json(cobros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar cobro (ej: monto, estado)
exports.actualizar = async (req, res) => {
  try {
    const { idCobro } = req.params;
    await Cobro.update(req.body, { where: { idCobro } });
    res.json({ mensaje: 'Cobro actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar cobro
exports.eliminar = async (req, res) => {
  try {
    const { idCobro } = req.params;
    await Cobro.destroy({ where: { idCobro } });
    res.json({ mensaje: 'Cobro eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.vigencia = async (req,res) =>
{
  try {
    const {idPension} = req.body;
    const response = await Cobro.findOne({
      attributes:['fechaVencimiento'],
      order: [['idCobro', 'ASC']],
      where: {idPension:idPension, estado:0}
  });
  return res.status(200).json(response);
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}

exports.cobrosxpagos = async (req,res) =>{
  try
  {
    const {idPension} = req.body;
    const response = await Cobro.findAll(
      {
        attributes:["periodo","estado","fechaVencimiento"],
        include:[
          {
            model:Pago,
            as:"pagoPs",
            attributes:["idPago","fechaPago","montoPagado"]
          }
        ],
        where:{idPension:idPension},
        order: [["periodo", "ASC"]],
        raw:true
      }
    )
    res.status(200).json(response)
  }catch (error)
  {
    console.log(error);
    res.status(500).json(error);
  }
}
