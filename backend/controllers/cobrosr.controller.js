const cobrosr = require('../models/cobrosR');

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