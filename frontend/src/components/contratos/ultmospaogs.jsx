import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { useEffect, useState } from "react";
import { pagoxcobro } from "../../api/contratos";

export default function ModalMostrarPagos({ isOpen, setIsOpen, contrato }) {
    const [cobros, setCobros] = useState([]);

    useEffect(() => {
        if (contrato?.idContrato) getCobros(contrato.idContrato);
    }, [contrato]);

    const getCobros = async (idContrato) => {
        try {
            console.log(idContrato)
            const res = await pagoxcobro({ idContrato });
            setCobros(res.data); // res.data contiene periodo, estado, pagoPs
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-sm" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">

                    <DialogTitle className="text-xl font-semibold mb-4">
                        Pagos de Pensiones
                    </DialogTitle>

                    {/* Contenedor con scroll */}
                    <div className="overflow-y-auto max-h-80 border rounded-xl shadow-sm">

                        <table className="min-w-full text-sm">

                            {/* ENCABEZADO FIJO */}
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider border-b sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="py-3 px-4 text-left">Periodo</th>
                                    <th className="py-3 px-4 text-left">Estado</th>
                                    <th className="py-3 px-4 text-left">Folio</th>
                                    <th className="py-3 px-4 text-left">Fecha Pago</th>
                                    <th className="py-3 px-4 text-right">Monto</th>
                                </tr>
                            </thead>

                            {/* CUERPO */}
                            <tbody className="text-gray-800">
                                {console.log(cobros)}
                                {cobros?.map((p, idx) => (
                                    <tr
                                        key={p.folio || idx}
                                        className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                            } hover:bg-gray-100 transition`}
                                    >
                                        <td className="py-3 px-4">
                                            {console.log(new Date(p.periodo))}
                                            {new Date(`${p.periodo}T00:00:00`).toLocaleDateString("es-MX", {
                                                month: "long",
                                            })}
                                        </td>

                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 text-xs rounded-full font-semibold
                                    ${p.estado
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >
                                                {p.estado ? "Pagado" : "Pendiente"}
                                            </span>
                                        </td>

                                        <td className="py-3 px-4">
                                            {p["pagos.folio"] ? p["pagos.folio"] : "---"}
                                        </td>

                                        <td className="py-3 px-4">
                                            {p["pagos.fechaPago"]
                                                ? new Date(p["pagos.fechaPago"]).toLocaleDateString("es-MX")
                                                : "---"}
                                        </td>

                                        <td className="py-3 px-4 text-right font-medium">
                                            ${p["pagos.monto"] ? p["pagos.monto"] : "0"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                </DialogPanel>
            </div>


        </Dialog>
    );
}
