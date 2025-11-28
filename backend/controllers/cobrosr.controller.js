const cobrosr = require('../models/cobrosR');
const pagos = require('../models/pagos');

exports.listarCobrosR = async (req, res) => {
    try {
        const cobros = await cobrosr.findAll();
         return res.status(200).json(cobros); 
        } 
    catch (e) {
            console.log(e);
        return res.status(501).json("Error al consultar cobros recurrentes");
    } 
};

exports.ultimoCobroContrato = async (req, res) => {
    const { idContrato } = req.body;
    try {
        const cobro = await cobrosr.findOne({
            where: { idContrato:idContrato, estado:0 },
            order: [['idCobro', 'DESC']],
        });
         return res.status(200).json(cobro); 
        }catch (e) {
            console.log(e);
        return res.status(501).json("Error al consultar ultimo cobro recurrente");
    }  
};

exports.pagosxcobro = async (req,res) => {
  try {
    const {idContrato} = req.body;
    const pagosdb = await cobrosr.findAll({
       attributes:["periodo","estado","fechaVencimiento"],
        include:[
          {
            model:pagos,
            as:"pagos",
            attributes:["folio","fechaPago","monto"]
          }
        ],
        where:{idContrato:idContrato},
        order: [["periodo", "ASC"]],
        raw:true
    });
    res.status(200).json(pagosdb);
  } catch (error) {
    console.log(error)
    return res.status(500).json(error);
  }
}
