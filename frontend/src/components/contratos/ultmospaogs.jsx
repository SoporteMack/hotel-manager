import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { useEffect, useState } from "react";
import { ultimosPago } from "../../api/contratos";
export default function UltimosPagos({ isOpen, setIsOpen, contrato }) {
    const [pagos, setPagos] = useState([]);
    const [numPagosBD, setNumPagosBD] = useState(0);
    const [mesesTranscurridos, setMesesTranscurridos] = useState(0);

    // 1. Cargar pagos cuando cambie el contrato
    useEffect(() => {
        getUltimosPagos(contrato.idContrato);
    }, [contrato.idContrato]);

    // 2. Calcular meses transcurridos
    useEffect(() => {
        const fechaInicio = new Date(contrato.fechaInicio);
        const fechaActual = new Date();

        const meses =
            (fechaActual.getFullYear() - fechaInicio.getFullYear()) * 12 +
            (fechaActual.getMonth() - fechaInicio.getMonth());
            if(meses>1)
                setMesesTranscurridos(meses);
            else
                setMesesTranscurridos(1);
    }, [contrato.fechaInicio]);

    // 3. Función para obtener pagos
    const getUltimosPagos = async (idContrato) => {
        const data = await ultimosPago({ idContrato }).then(res => res.data);

        setPagos(data.pagos);
        setNumPagosBD(data.numpagos);
    };
    const mesesLista = Array.from({ length: mesesTranscurridos }, (_, i) => {
        const fecha = new Date(contrato.fechaInicio);
        fecha.setMonth(fecha.getMonth() + i + 1);
        const fechaPago = pagos[i] ? pagos[i].fechaPago : null;
        const monto = pagos[i] ? pagos[i].monto : 0;

        return {
            mes: fecha.toLocaleDateString("es-MX", {
                month: "long",
                year: "numeric"
            }),
            pagado: i < numPagosBD,
            fechaPago: fechaPago,
            monto: monto
        };
    });

    return (

        <>

            <Dialog open={isOpen} onClose={() => { setIsOpen(false) }} className="relative z-50 w-full h-full" >
                <DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
                <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-6">
                    <DialogPanel className="w-full max-w-sm sm:max-w-2xl rounded-lg bg-white p-6 shadow-md">
                        <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
                            Ultimos Pagos
                        </DialogTitle>
                        <DialogPanel>
                            <div className="max-h-80 overflow-y-auto border rounded-md">
                                <table className="w-full table-auto border-collapse">
                                    <thead className="bg-gray-100 sticky top-0">
                                        <tr className="border-b">
                                            <th className="py-2 text-left">Mes</th>
                                            <th className="py-2 text-left">Pagado</th>
                                            <th className="py-2 text-left">Fecha de Pago</th>
                                            <th className="py-2 text-left">Monto</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {mesesLista.map((m, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="py-2 capitalize">{m.mes}</td>
                                                <td className="py-2">
                                                    {m.pagado ? (
                                                        <span className="text-green-600 font-semibold">Sí</span>
                                                    ) : (
                                                        <span className="text-red-600 font-semibold">No</span>
                                                    )}
                                                </td>
                                                <td className="py-2">
                                                    {m.fechaPago
                                                        ? new Date(m.fechaPago).toLocaleDateString("es-MX")
                                                        : "---"}
                                                </td>
                                                <td className="py-2">
                                                    ${m.monto.toLocaleString("es-MX")}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </DialogPanel>


                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}