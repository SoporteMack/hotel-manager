const departamentos = require("../models/departamentos");
exports.listar = async (req, res) => {
  const lista = await departamentos.findAll();
  res.json(lista);
};

exports.crear = async (req, res) => {
  const {descripcion, costo, estatus } = req.body;
  try {
    const departamentobd = await departamentos.create({
      descripcion:descripcion,
      costo: costo,
      estatus: estatus,
    });
    res
      .status(201)
      .json({ status: true, msg: "Departamento Creado con Exito" });
  } catch (e) {
    if (e.name === "SequelizeValidationError") {
      const errores = e.errors.map((err) => ({
        campo: err.path,
        mensaje: err.message,
      }));
      return res.status(400).json({ status: false, errores });
    } else if (e.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        status: false,
        msg: "El número de departamento ya existe",
      });
    }
    console.error(e);
    res
      .status(500)
      .json({ status: false, mensaje: "Error crear Departamento" });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const numDep = req.params.numDep;
    const datos = req.body;
    const depfind = await departamentos.findByPk(numDep);
    if (!depfind)
      return res
        .status(404)
        .json({ status: false, msg: "numero de departamento no econtrado" });
    await depfind.update(datos);
    res
      .status(200)
      .json({ status: true, msg: "Datos de Departamento actulizados" });
  } catch (e) {
    if (e.name === "SequelizeValidationError") {
      const errores = e.errors.map((err) => ({
        campo: err.path,
        mensaje: err.message,
      }));
      return res.status(400).json({ status: false, errores });
    }

    console.error(e);
    res
      .status(500)
      .json({ status: false, mensaje: "Error al actualizar datos de Departamento" });
  }
};


exports.listarActivos = async (req,res)=>{
  try{
    const lista = await departamentos.findAll({
      attributes:["numDepartamento","descripcion"],
      where:{
        estatus:true
      }
    })
    res.status(200).json({status:true,lista:lista})
  }catch(e)
  {
    console.log(e)
    res.status(500).json({status:false,msg:"error al cargar departamentos"})
  }
  
}