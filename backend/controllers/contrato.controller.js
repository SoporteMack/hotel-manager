const { where, Op, fn, col, DATE } = require('sequelize');
const contratos = require('../models/contratos');
const departamentos = require('../models/departamentos');
const personas = require('../models/personas');
const path = require("path");
const fs = require("fs");
const pagos = require('../models/pagos');

exports.listar = async (req, res) => {
  const lista = await contratos.findAll({
    include:
      [{
        model: personas,
        as: 'persona',
        attributes: ["nombrePersona", "apellidoPaterno", "apellidoMaterno"]
      },
      {
        model: departamentos,
        as: 'departamento',
        attributes: ["descripcion"]
      }]
  });
  res.json(lista);
}

exports.crear = async (req, res) => {
  const archivosGuardados = [];

  try {
    const data = req.body;
    const files = req.files;

    // Validaciones
    if (!data || !files) return res.status(400).json({ msg: "Datos incompletos" });

    // Verifica existencia de contrato activo
    const contratoExistente = await contratos.findOne({
      where: { numDepartamento: data.numDepartamento, estatus: { [Op.is]: true } }
    });
    if (contratoExistente)
      return res.status(400).json({ msg: "Ya existe un contrato activo con ese departamento" });

    // Obtener nombre completo del inquilino
    const persona = await personas.findOne({
      attributes: ["nombrePersona", "apellidoPaterno", "apellidoMaterno"],
      where: { idPersona: data.idPersona }
    });
    if (!persona) return res.status(404).json({ msg: "Persona no encontrada" });

    const nombre = `${data.idPersona}_${persona.nombrePersona}_${persona.apellidoPaterno}_${persona.apellidoMaterno}`.replace(/\s+/g, "_");
    const fechaObj = new Date(data.fechaInicio);
    const fechaTexto = `contrato_${fechaObj.getDate().toString().padStart(2, "0")}_${(fechaObj.getMonth() + 1).toString().padStart(2, "0")}_${fechaObj.getFullYear()}`;
    const carpeta = path.join("uploads", `${nombre}_${fechaTexto}`);
    fs.mkdirSync(carpeta, { recursive: true });

    const guardarArchivo = (campo, nombre) => {
      if (files[campo]?.[0]) {
        const archivo = files[campo][0];
        const ext = path.extname(archivo.originalname);
        const nombreArchivo = `${campo}_${Date.now()}_${nombre}${ext}`;
        const fullPath = path.join(carpeta, nombreArchivo);
        fs.writeFileSync(fullPath, archivo.buffer);
        archivosGuardados.push(fullPath);
        return `/${fullPath.replace(/\\\\/g, "/")}`;
      }
      return null;
    };

    data.INED = guardarArchivo("ineD", nombre);
    data.INEA = guardarArchivo("ineA", nombre);
    data.comprobanteDeDomicilio = guardarArchivo("comprobatededomicilio", nombre);
    data.tarjetaD = guardarArchivo("tarjetaD", nombre);
    data.tarjetaA = guardarArchivo("tarjetaA", nombre);


    await contratos.create(data);

    await departamentos.update(
      { estatus: false },
      { where: { numDepartamento: data.numDepartamento } }
    );

    res.status(201).json({ msg: "Contrato creado correctamente" });
  } catch (e) {
    // Limpia archivos si hay error
    archivosGuardados.forEach(file => {
      try { fs.unlinkSync(file); } catch { }
    });

    console.error(e);
    res.status(500).json({ msg: "Error al crear contrato", error: e.message });
  }
};


exports.porcentajeocupado = async (req, res) => {
  try {
    // Contratos activos (ocupados)
    const contratoactivos = await contratos.findOne({
      attributes: [[fn('COUNT', col('departamento.numDepartamento')), 'total']],
      where: { estatus: true },
      include: [{
        model: departamentos,
        as: 'departamento',
        attributes: [], // no necesitas columnas extra
        required: true
      }],
      raw: true
    });

    // Departamentos activos
    const totalDepartamentosdb = await departamentos.findOne({
      attributes: [[fn('COUNT', col('numDepartamento')), 'total']],
      raw: true
    });
    const totalDepartamentosLibres = await departamentos.findOne(
      {
        attributes: [[fn('COUNT', col('numDepartamento')), 'total']],
        where: { estatus: true },
        raw: true
      }
    )

    // Extrae los totales
    const totalOcupados = parseInt(contratoactivos.total || 0);
    const totalDepartamentos = parseInt(totalDepartamentosdb.total || 0);
    const totallibres = parseInt(totalDepartamentosLibres.total || 0);
    // Calcula porcentaje
    const porcentaje = totalDepartamentos === 0
      ? 0
      : ((totalOcupados / totalDepartamentos) * 100).toFixed(2);

    // Devuelve resultado
    res.json({
      departamentosActivos: totalDepartamentos,
      libres: totallibres,
      ocupados: totalOcupados,
      porcentaje: `${porcentaje}%`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al calcular porcentaje" });
  }
};

exports.contratoxnombre = async (req, res) => {
  try {
    const nombre = req.query.nombre;
    const apellidoP = req.query.apellidoP;
    const apellidoM = req.query.apellidoM;
    const contratosdb = await contratos.findAll({
      attributes: ["idContrato", "idPersona", "numDepartamento", "deuda", "fechaInicio"],
      where: { estatus: 1 },
      include: [{
        model: personas,
        as: "persona",
        attributes: ["nombrePersona", "apellidoPaterno", "apellidoMaterno"],
        where: {
          [Op.or]: [
            nombre ? { nombrePersona: { [Op.like]: `%${nombre}%` } } : {},
            apellidoP ? { apellidoPaterno: { [Op.like]: `%${apellidoP}%` } } : {},
            apellidoM ? { apellidoMaterno: { [Op.like]: `%${apellidoM}%` } } : {},
          ]
        }
      },
      {
        model: departamentos,
        as: "departamento",
        attributes: ["descripcion"]
      }
      ]
    })
    return res.status(200).json(contratosdb);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

}

exports.vencetredias = async (fecha) => {

  try {
    const res = contratos.findAll({
      attributes: ["idcontrato"],
      include: [
        {
          model: personas,
          as: "persona",
          attributes: ["telefono"]
        }
      ],
      where: { fechaPago: fecha },
      raw: true
    })
    return res
  } catch (e) {
    return []
  }
}

exports.rentasvencidas = async(req,res)=>{
  try {
    const rentasConPagos = await this.buscarRentasVencidas();
    res.status(200).json(rentasConPagos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.buscarRentasVencidas = async () => {
  try {
    const rentasv = await contratos.findAll({
      attributes: ["idContrato", "deuda"],
      where: { deuda: { [Op.gt]: 0 } },
      include: [
        {
          model: personas,
          as: "persona",
          attributes: ["nombrePersona", "apellidoPaterno", "apellidoMaterno"]
        },
        {
          model: departamentos,
          as: "departamento",
          attributes: ["descripcion"]
        }
      ],
      raw: true
    });

    // Usar Promise.all para manejar las operaciones asíncronas dentro del map
    const rentasConPagos = await Promise.all(rentasv.map(async (rentav) => {
      const ultimopago = await pagos.findOne({
        where: { idContrato: rentav.idContrato },
        order: [['numPago', 'DESC']], // Corregida la sintaxis del order
        raw: true
      });

      return {
        ...rentav,
        ultimoPago: ultimopago
      };
    }));
  return rentasConPagos
    
  } catch (error) {
    return[];
  }
}