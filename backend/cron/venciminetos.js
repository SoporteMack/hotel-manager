const schedule = require('node-schedule');
const contratos = require('../models/contratos');
const departamentos = require('../models/departamentos');
const { where, Op } = require('sequelize');

// Programar la tarea a las 8:00 AM todos los días
const tarea = schedule.scheduleJob(' */5 * * * *', async () => {
    const fecha = new Date();
    const diaanterior = new Date();
    diaanterior.setDate(diaanterior.getDate() - 1);
    diaanterior.setMonth(diaanterior.getMonth()+1);
    const formdiaant = formatFechaHoraLocal(diaanterior);
    const fechaformateada = formatFechaHoraLocal(fecha);
    const dep = await obtenerdep(fechaformateada);

    await aumentarInteres(formdiaant);
    await aumentarDeuda(dep);
});

const formatFechaHoraLocal = (fecha) => {
    const f = new Date(fecha);
    const pad = n => n.toString().padStart(2, '0');
    return `${f.getFullYear()}-${pad(f.getMonth() + 1)}-${pad(f.getDate())}`;
};

const obtenerdep = async (fecha) => {
    try {
        const contratosdb = await contratos.findAll({
            attributes: ["idContrato", "deuda","fechaPago"],
            where: { fechaPago: fecha, estatus: 1 },
            required: false,
            include: [{
                model: departamentos,
                as: "departamento",
                attributes: ["costo"]
            }],
            raw: true
        })
        return contratosdb;
    } catch (error) {
        return [];
    }
}

const aumentarDeuda = async (deps) => {
    if (!deps || deps.length === 0) {
        console.log('⚠️ No hay contratos para procesar.');
        return;
    }

    for (const dep of deps) {
        const id = dep.idContrato;
        const deudaActual = parseFloat(dep.deuda);
        const fechaPago = new Date(dep.fechaPago);
        fechaPago.setDate(fechaPago.getDate()+1)
        fechaPago.setMonth(fechaPago.getMonth()+1);
        const costo = parseFloat(dep['departamento.costo']) || 0;

        const nuevaDeuda = deudaActual + costo;
        try {
            await contratos.update(
                { deuda: nuevaDeuda,fechaPago:fechaPago },
                { where: { idContrato: id } }
            );
            console.log(`✅ Deuda actualizada para contrato ${id}: ${nuevaDeuda}`);
        } catch (error) {
            console.error(`❌ Error al actualizar contrato ${id}:`, error);
        }
    }
};

const aumentarInteres = async (diaAnterior) => {
    try {
        const contratosdb = await obenterretaatrasada(diaAnterior)
        for (const contrato of contratosdb) {
            const costo = contrato['departamento.costo'] || 0;
            const interes = Math.round(costo * 0.10);
            const nuevadeuda = parseFloat(contrato.deuda) + interes;
            await contratos.update({ deuda: nuevadeuda }, { where: { idContrato: contrato.idContrato } });

        }
    } catch (error) {
        console.log(error)
    }

}

const obenterretaatrasada = async (fecha) => {
    try {
        const contratosdb = await contratos.findAll({
            attributes: ["idContrato", "deuda"],
            where: { fechaPago: fecha, estatus: 1,deuda:{[Op.gt]:0}},
            required: false,
            include: [{
                model: departamentos,
                as: "departamento",
                attributes: ["costo"]
            }],
            raw: true
        })
        return contratosdb;
    } catch (error) {
        return [];
    }
}
