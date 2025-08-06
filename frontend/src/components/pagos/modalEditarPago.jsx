import { Description, Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import { useState, useRef } from 'react';
import { editarpago } from '../../api/pagos';
import { Notyf } from 'notyf';
function ModalEditarPago({ onClose, isOpen, data }) {
    const [pago, setPago] = useState(0);
    const folio = data.folio;
    const notyf = useRef(new Notyf({
            duration: 10000,
            dismissible: true,
            position: { x: 'center', y: 'top' },
        }));
    const handleEditar = async ()=>{
        const data = {
            monto:pago,
            folio:folio
        }
        try {
            await editarpago(data).then(res =>{console.log(res)})
            notyf.current.success("Pago Editado Correctamente")
            onClose();
        } catch (error) {
            notyf.current.error("error al editar el pago")
        }
    }
    return (
        <Dialog open={isOpen} onClose={onClose} as="div" className="relative z-50 w-full">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/50 backdrop-blur-sm duration-300 ease-out data-closed:opacity-0"
            />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel
                    transition
                    className="w-full max-w-4xl rounded-2xl bg-white shadow-xl overflow-hidden transform transition-all duration-300"
                >
                    <div className="p-6 md:p-8 space-y-6">
                        <div className="border-b pb-4">
                            <DialogTitle className="text-2xl font-bold text-gray-800">Inquilinos</DialogTitle>
                            <Description className="text-gray-500">Coincidencia de búsqueda por nombre</Description>
                        </div>
                        <div className="overflow-x-auto">
                            <div className="w-full p-2 flex flex-col md:flex-row md:items-center">
                                <label
                                    htmlFor="nombrecompleto"
                                    className="text-sm font-medium text-gray-700 mb-1 md:mb-0 md:w-40"
                                >
                                    Nombre(s):
                                </label>
                                <input
                                    id="nombrecompleto"
                                    type="text"
                                    className="w-full md:flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    value={`${data.contrato.persona.nombrePersona} ${data.contrato.persona.apellidoMaterno} ${data.contrato.persona.apellidoPaterno}`}
                                    disabled
                                />
                            </div>

                            <div className="w-full p-2 flex flex-col md:flex-row md:items-center">
                                <label
                                    htmlFor="deuda"
                                    className="text-sm font-medium text-gray-700 mb-1 md:mb-0 md:w-40"
                                >
                                    Deuda:
                                </label>
                                <input
                                    id="deuda"
                                    type="text"
                                    className="w-full md:flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm"
                                    disabled
                                    value={data.contrato.deuda}
                                />
                            </div>

                            <div className="w-full p-2 flex flex-col md:flex-row md:items-center">
                                <label
                                    htmlFor="departamento"
                                    className="text-sm font-medium text-gray-700 mb-1 md:mb-0 md:w-40"
                                >
                                    Departamento:
                                </label>
                                <input
                                    id="departamento"
                                    type="text"
                                    className="w-full md:flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm"
                                    disabled
                                    value={data.contrato.departamento.descripcion}
                                />
                            </div>

                            <div className="w-full p-2 flex flex-col md:flex-row md:items-center">
                                <label
                                    htmlFor="pago"
                                    className="text-sm font-medium text-gray-700 mb-1 md:mb-0 md:w-40"
                                >
                                    Pago:
                                </label>
                                <input
                                    id="pago"
                                    type="number"
                                    className="w-full md:flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm"
                                    onChange={(e) => setPago(Number(e.target.value) || 0)}
                                />
                            </div>
                            <div className="w-full p-2 flex justify-end">
                                <button
                                    type="button"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition"
                                    onClick={handleEditar}
                                >
                                    Pagar
                                </button>
                            </div>


                        </div>
                        {pago}
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}

export default ModalEditarPago;