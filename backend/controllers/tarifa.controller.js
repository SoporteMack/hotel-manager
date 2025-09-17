const tarifas = require("../models/tarifas")

exports.listar = async (req,res)=>
{
    try {
        const lista = await tarifas.findAll();
        res.status(200).json(lista);
    } catch (error) {
        res.statu(500).json(error);
    }
}

exports.crear = async (req,res) =>
{
    try {
        const data = req.body;
        await tarifas.create(data);
        res.status(200).json({status:true,msg:"tarifa creado correctamente"});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
exports.actualizar = async (req, res) => {
    try {
        const { id } = req.params;  
        const data = req.body;

        const [actualizados] = await tarifas.update(data, {
            where: { idTarifa: id }
        });

        const tarifaActualizada = await tarifas.findByPk(id);
        res.status(200).json({ status: true, msg: "Tarifa actualizada correctamente", data: tarifaActualizada });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

exports.tarifasA = async (req,res)=>{
    try {
        const lista = await tarifas.findAll({where:{estado : 1}});
        res.status(200).json(lista);
    } catch (error) {
        res.statu(500).json(error);
    }
}