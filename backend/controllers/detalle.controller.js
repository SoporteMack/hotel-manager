const detalles = require("../models/detalle")

exports.listar = async (req,res)=>{
try{
    const response = await detalles.findAll()
    res.status(200).json(response);
}catch(error)
{
    res.status(500).json(error);
}
}

exports.crear = async (req,res)=>
{
    try{
        const data = req.body;
        await detalles.create(data);
        res.status(200).json({status:true,msg:"Detalle Agregado Correctamente"});
    }catch(e)
    {
        res.status(500).json(e);
    }
}