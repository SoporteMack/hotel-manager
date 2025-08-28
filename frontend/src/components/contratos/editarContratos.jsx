import { Description, Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import { listaActivosInquilinos } from "../../api/Inquilinos";
import { departamentosactivosyactual } from "../../api/departamentos";
import { useEffect, useState, useRef } from "react";
import Lista from "../items/lista";
function editarContrato({ onClose, isOpen, setIsOpen, contrato, setData }) {
    const [listaInquilinos, setListaInquilinos] = useState([]);
    const [listaDepartamentos, setListaDepartamentos] = useState([]);
    const [inquilinos, setInquilinos] = useState(null);
    const [departamento, setDepartamento] = useState(null);
    useEffect(() => {
        cargarListas(contrato);
    }, []);
    const cargarListas = async (contrato) => {
        try {
            const [resInq, resDeptos] = await Promise.all([
                listaActivosInquilinos(),
                departamentosactivosyactual(contrato.numDepartamento),
            ]);
            setListaInquilinos(
                resInq.data.lista.map((i) => ({
                    value: i.idPersona,
                    label: `${i.nombrePersona} ${i.apellidoPaterno} ${i.apellidoMaterno}`,
                }))
            );
            setListaDepartamentos(
                resDeptos.data.lista.map((d) => ({
                    value: d.numDepartamento,
                    label: d.descripcion,
                }))
            );
        } catch (error) {
            console.log(error)
            notyf.current.error("error al cargar los datos");
        }
    };
    const handledata = (data) => {
        setData();
        setIsOpen(false);
    }
    const handleguardar = ()=>{
        
    }
    return (
        <Dialog open={isOpen} onClose={onClose} as="div" className="relative z-50 w-full h-100">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/50 backdrop-blur-sm duration-300 ease-out data-closed:opacity-0"
            />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel
                    transition
                    className="w-full max-w-4xl  rounded-2xl bg-white shadow-xl overflow-hidden transform transition-all duration-300"
                >
                    <form onSubmit={handleguardar}>
                        <div className="p-6 md:p-8 space-y-6 ">
                            <div className="border-b pb-4">
                                <DialogTitle className="text-2xl font-bold text-gray-800">Departamento {contrato.departamento.descripcion}</DialogTitle>
                                <Description className="text-gray-500">Información sobre el contrato de arrendamineto de la persona {('\n', contrato.persona.nombrePesona)} {contrato.persona.apellidoPaterno} {contrato.persona.apellidoMaterno}</Description>
                                <input type="text" defaultValue={contrato.persona.nombrePersona} />
                            </div>
                            <div className="overflow-x-auto h-[40vh]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 ">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Persona *</label>
                                        <Lista options={listaInquilinos} value={inquilinos} defaultValue={contrato.idPersona} onChange={setInquilinos} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
                                        <Lista options={listaDepartamentos} value={departamento} defaultValue={contrato.numDepartamento} onChange={setDepartamento} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                                    <div className="">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Deuda *</label>
                                        <input
                                            type="text"
                                            defaultValue={contrato.deuda}
                                            className="w-full border border-gray-300 rounded px-4 py-2 pl-10 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                                        />
                                    </div>
                                    <div className="">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Deposito *</label>
                                        <input
                                            type="text"
                                            defaultValue={contrato.deposito}
                                            className="w-full border border-gray-300 rounded px-4 py-2 pl-10 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                                    <div className="">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio *</label>
                                        <input
                                            type="date"
                                            defaultValue={contrato.fechaInicio}
                                            className="w-full border border-gray-300 rounded px-4 py-2 pl-10 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                                        />
                                    </div>
                                    <div className="">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Termino *</label>
                                        <input
                                            type="date"
                                            defaultValue={contrato.fechaTermino}
                                            className="w-full border border-gray-300 rounded px-4 py-2 pl-10 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 p-2">
                                    <button type="submit">Actulizar</button>
                                </div>
                            </div>

                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
}

export default editarContrato;