const { Op, fn, col, where } = require('sequelize');
const contratos = require('../models/contratos');
const departamentos = require('../models/departamentos');
const personas = require('../models/personas');
const pagos = require('../models/pagos');
const Configuracion = require('../models/configuracion')

const path = require('path');
const fs = require('fs');

const { getSock } = require('../utils/baileys');


const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const mammoth = require('mammoth'); // para convertir docx a HTML
const puppeteer = require('puppeteer');
const { NumerosALetras } = require('numero-a-letras');
const persona = require('../models/personas');


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
exports.subirComprobante = async (req, res) => {
  const archivosGuardados = [];
  try {
    const data = req.body;
    const files = req.files;
    const persona = await personas.findOne({
      attributes: ["nombrePersona", "apellidoPaterno", "apellidoMaterno"],
      where: { idPersona: data.idPersona }
    });
    if (!persona) return res.status(404).json({ msg: "Persona no encontrada" });
    const nombre = `${data.idPersona}_${persona.nombrePersona}_${persona.apellidoPaterno}_${persona.apellidoMaterno}_${data.numDepartamento}`.replace(/\s+/g, "_");
    const carpeta = path.join("uploads", `${nombre}`);
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
    data.comprobanteDeDomicilio = guardarArchivo("comprobatededomicilio", nombre);
    const condb = await contratos.update({ comprobanteDeDomicilio: data.comprobanteDeDomicilio }, { where: { idContrato: data.idContrato } })
    console.log(data)
    res.status(200).json(condb);
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
}
exports.subirTarjeta = async (req, res) => {
  const archivosGuardados = [];
  try {
    const data = req.body;
    const files = req.files;
    const persona = await personas.findOne({
      attributes: ["nombrePersona", "apellidoPaterno", "apellidoMaterno"],
      where: { idPersona: data.idPersona }
    });
    if (!persona) return res.status(404).json({ msg: "Persona no encontrada" });
    const nombre = `${data.idPersona}_${persona.nombrePersona}_${persona.apellidoPaterno}_${persona.apellidoMaterno}_${data.numDepartamento}`.replace(/\s+/g, "_");
    const carpeta = path.join("uploads", `${nombre}`);
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
    data.tarjetaA = guardarArchivo("tarjetaA", nombre);
    data.tarjetaD = guardarArchivo("tarjetaD", nombre);
    const condb = await contratos.update({ tarjetaA: data.tarjetaA, tarjetaD: data.tarjetaD }, { where: { idContrato: data.idContrato } })
    console.log(data)
    res.status(200).json(condb);
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
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

    const nombre = `${data.idPersona}_${persona.nombrePersona}_${persona.apellidoPaterno}_${persona.apellidoMaterno}_${data.numDepartamento}`.replace(/\s+/g, "_");
    //const fechaObj = new Date(data.fechaInicio);
    //const fechaTexto = `contrato_${fechaObj.getDate().toString().padStart(2, "0")}_${(fechaObj.getMonth() + 1).toString().padStart(2, "0")}_${fechaObj.getFullYear()}`;_${fechaTexto}
    const carpeta = path.join("uploads", `${nombre}`);
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


    const condb = await contratos.create(data);
    await departamentos.update(
      { estatus: false },
      { where: { numDepartamento: data.numDepartamento } }
    );

    res.status(201).json({ msg: "Contrato creado correctamente", idContrato: condb.idContrato });
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

exports.venceundia = async (req, res) => {
  try {
    const dia = req.query.fecha;
    const resp = await this.vencetredias(dia);
    return res.status(200).json(resp);
  } catch (error) {
    return res.status(500).json([]);
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
          attributes: ["nombrePersona", "apellidoPaterno", "apellidoMaterno", "telefono"]
        },
        {
          model: departamentos,
          as: "departamento",
          attributes: ["descripcion"]
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

exports.rentasvencidas = async (req, res) => {
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
    return [];
  }
}

exports.actualizarContratogeneral = async (req, res) => {
  const data = req.body;
  console.log(data)
  try {
    const response = await contratos.findOne({ attributes: ["idContrato", "idPersona", "numDepartamento", "deposito", "deuda", "fechaInicio", "fechaTermino"], where: { idContrato: data.idContrato } })
    if (!response)
      return res.status(404).json({ estatus: false, msg: "Contrato no Encotrado" });
    const datos = {};
    if (data.idPersona !== undefined) datos.idPersona = data.idPersona;
    if (data.numDepartamento !== undefined) datos.numDepartamento = data.numDepartamento;
    if (data.deposito !== undefined) datos.deposito = data.deposito;
    if (data.deuda !== undefined) datos.deuda = data.deuda;
    if (data.fechaInicio !== undefined) datos.fechaInicio = data.fechaInicio;
    if (data.fechaTermino !== undefined) datos.fechaTermino = data.fechaTermino;

    console.log(datos)
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No hay datos para actualizar" });
    }
    await contratos.update(datos, {
      where: { idContrato: data.idContrato }
    });

    await generarContrato(data.idContrato)
    enviarmsg(data.idContrato);
    res.status(200).json({ msg: "Contrato Actulizado" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ estatus: false, error: error })
  }
}


const generarContrato = async (idContrato) => {
  const contratodb = await findContrato(idContrato);
  const fechai = new Date(contratodb.fechaInicio);
  const fechaf = new Date(contratodb.fechaTermino);
  const config = await datosBanco();
  const montoalfa = NumerosALetras(contratodb.departamento.costo)
  const nombre = `${contratodb.idPersona}_${contratodb.persona.nombrePersona}_${contratodb.persona.apellidoPaterno}_${contratodb.persona.apellidoMaterno}_${contratodb.numDepartamento}`.replace(/\s+/g, "_");
  const nom = `${contratodb.persona.nombrePersona} ${contratodb.persona.apellidoPaterno} ${contratodb.persona.apellidoMaterno}`
  try {
    const datos = {
      nombre: String(nom).toUpperCase(),
      direccion: "C. 1 Nte 222, Centro de la Ciudad, 75700 Tehuacán, Pue.",
      diai: String(fechai.getDate()).padStart(2, '0'),
      mesi: String(fechai.getMonth()).padStart(2, '0'),
      anioi: fechai.getFullYear(),
      diaf: String(fechaf.getDate()).padStart(2, '0'),
      mesf: String(fechaf.getMonth()).padStart(2, '0'),
      opciones: ["Baño privado", "Closet", "Base para Colchon"],
      aniof: fechaf.getFullYear(),
      monto: contratodb.departamento.costo,
      montoalfa: montoalfa,
      banco: config.banco,
      titular: config.titular,
      clave: config.numCuenta,
      ciudadfirma: 'TEHUACAN',
      diafirma: String(fechai.getDate()).padStart(2, '0'),
      mesfirma: String(new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(fechai)).toUpperCase(),
      aniofirma: String(fechai.getFullYear()),
      deposito: contratodb.deposito
    }
    console.log('--------------------------------',datos.opciones)
    const outputPdfPath = path.resolve(__dirname, '../uploads/' + nombre, 'contrato_final.pdf');
    const contenido = fs.readFileSync(path.resolve(__dirname, '../uploads/templates/test.docx'), 'binary');
    const zip = new PizZip(contenido);
    const options = {
      delimiters: {
        start: "{",
        end: "}",
      },
      paragraphLoop: true,
      linebreaks: true,
    };
    const doc = new Docxtemplater(zip, options);

    try {
      doc.render(datos);
    } catch (error) {
      console.error('Error al renderizar docx:', error);
      throw error;
    }
    const bufferDocx = doc.getZip().generate({ type: 'nodebuffer' });
    const tempDocxPath = path.resolve(__dirname, 'temp.docx');
    fs.writeFileSync(tempDocxPath, bufferDocx);
    let { value: html } = await mammoth.convertToHtml({ path: tempDocxPath });
    const imageBuffer = fs.readFileSync(path.resolve(__dirname, '../uploads/templates/encabezado.png'));
    const base64Image = imageBuffer.toString('base64');
    const mimeType = 'image/png'; // Cambia si usas .jpg, .webp, etc.

    // Incrustar imagen en el HTML
    html = `
  <div style="">
    <img src="data:image/png;base64,${base64Image}" style="width: 800px;" />
  </div>
  <div style="text-align: justify;">
    ${html}
  </div>
`;
    // Lanzar Puppeteer para generar PDF desde HTML
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 0 });

    await page.pdf({
      path: __dirname + '/../uploads/' + nombre + '/' + 'contrato_final.pdf',
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    });

    await browser.close();

    // Opcional: borrar temp docx
    fs.unlinkSync(tempDocxPath);
    return { "path": outputPdfPath, "telefono": contratodb.persona.telefono }




  } catch (error) {
    console.error('Error al generar contrato:', error);
  }
};

const findContrato = async (idContrato) => {
  return await contratos.findOne({
    attributes: ["idContrato", "fechaInicio", "fechaTermino", "deposito", "idPersona", "numDepartamento"],
    where: { idContrato: idContrato },
    include: [
      {
        model: personas,
        as: "persona",
        attributes: ["nombrePersona", "apellidoPaterno", "apellidoMaterno", "telefono"],
        required: true // Esto asegura que sea INNER JOIN
      },
      {
        model: departamentos,
        as: 'departamento',
        attributes: ['costo']
      }
    ],
    raw: true,
    nest: true
  });
}


const datosBanco = async () => {
  return await Configuracion.findOne({ attributes: ['banco', 'numCuenta', 'titular'] });
}

const enviarmsg = async (idContrato) => {
  const sock = getSock();
  const res = await contratos.findOne({
    attributes: ["idContrato"],
    where: { idContrato: idContrato },
    include: [{
      model: personas,
      as: "persona",
      attributes: ["nombrePersona", "apellidoPaterno", "apellidoMaterno"]
    }]
  }).then(res => { return res.persona })

  const telefono = await Configuracion.findOne().then(res => { return res.telefono });
  const nom = res.nombrePersona + " " + res.apellidoPaterno + " " + res.apellidoMaterno;
  const msj = "se actulizo contrato numero " + idContrato + "\n de la persona " + nom
  const numero = '521' + telefono;
  try {
    await sock.sendMessage(`${numero}@s.whatsapp.net`, {
      text: msj
    });
    console.log(`✅ Mensaje enviado a ${numero}`);

  } catch (err) {
    console.error('❌ Error al enviar mensaje:', err);
  }
}

exports.nombreDep = async (req, res) => {
  const { numdep } = req.query;
  console.log(numdep)

  try {
    const response = await contratos.findOne({
      where: { numDepartamento: numdep, estatus: true },
      attributes: ["numDepartamento"],
      include: [
        {
          model: persona,
          as: "persona",
          attributes: ["nombrePersona", "apellidoPaterno", "apellidoMaterno"]
        }
      ]
    }).then(res => { return (res.persona.nombrePersona + " " + res.persona.apellidoPaterno + " " + res.persona.apellidoMaterno) })
    res.status(200).json(response);
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
}