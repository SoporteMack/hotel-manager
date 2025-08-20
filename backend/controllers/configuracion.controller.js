const configuracion = require("../models/configuracion")

exports.listar = async (req, res) => {

    try {
        const config = await configuracion.findAll();
       return  res.status(200).json(config)
    } catch (e) {
        return res.status(501).json("error al consultar configuración")
    }

}
exports.actualizar = async (req, res) => {
    try {
      const { telefono, telefonoActual, horaRepDiario, numCuenta, banco, titular } = req.body;
  
      if (!telefonoActual) {
        return res.status(400).json({ error: "El teléfono actual es obligatorio para actualizar" });
      }
      if(horaRepDiario !== undefined && (parseInt(horaRepDiario)<0 || parseInt(horaRepDiario)>23 ))
      {
        return res.status(500).json("hora n vlaida")
      }
      // Buscar registro actual
      const registro = await configuracion.findOne({ where: { telefono: telefonoActual } });
  
      if (!registro) {
        return res.status(404).json({ error: "No se encontró configuración con ese teléfono" });
      }
  
      // Construir objeto con datos a actualizar
      const datosActualizar = {};
  
      if (telefono && telefono !== telefonoActual) {
        datosActualizar.telefono = telefono;
      }
  
      if (horaRepDiario !== undefined) datosActualizar.horaRepDiario = horaRepDiario;
      if (numCuenta !== undefined) datosActualizar.numCuenta = numCuenta;
      if (banco !== undefined) datosActualizar.banco = banco;
      if (titular !== undefined) datosActualizar.titular = titular;
  
      if (Object.keys(datosActualizar).length === 0) {
        return res.status(400).json({ error: "No hay datos para actualizar" });
      }
  
      // Ejecutar update
      const [filasActualizadas] = await configuracion.update(datosActualizar, {
        where: { telefono: telefonoActual }
      });
  
      /*if (filasActualizadas === 0) {
        return res.status(500).json({ error: "No se pudo actualizar la configuración" });
      }*/
  
      res.status(200).json({ mensaje: "Configuración actualizada correctamente" });
    } catch (error) {
      console.error("Error al actualizar configuración:", error);
      res.status(500).json({ error: "Error al actualizar la configuración" });
    }
  };
  
