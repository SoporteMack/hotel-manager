import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogBackdrop,
    DialogPanel,
} from "@headlessui/react";

export default function ModalPagos({ isOpen, onClose, pension, onGuardar, nombre,listar }) {
    const [monto, setMonto] = useState(0);
    useEffect(() => {
        if (pension) {
            setMonto(pension.precioAcordado || "");
        }
    }, [pension, isOpen]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!monto || isNaN(monto)) {
            alert("Ingresa un monto válido");
            return;
        }

        onGuardar({
            idPension: pension.idPension,
            monto: parseFloat(monto),
            fechaPago: new Date().toISOString().split("T")[0], // yyyy-mm-dd
        });

        setMonto("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} as="div" className="relative z-50 w-full">
            <DialogBackdrop className="fixed inset-0 bg-black/40" />

            <div className="fixed inset-0 flex items-center justify-center p-4">

                <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                    <DialogTitle className="text-lg font-semibold text-gray-900 mb-4">
                        Registrar Pago - {nombre || `Pensión #${pension?.idPension}`}
                    </DialogTitle>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="number"
                            step="1"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            placeholder="Monto"
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
