import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from "@headlessui/react";
import { Fragment, useState,useRef } from "react";
import { actualizarobservaciones } from "../../api/contratos";
import { Notyf } from "notyf";
import { useAuth } from "../../context/authContext";

function ModalObservaciones({ isOpen, setIsOpen, observaciones, idContrato, setLoading, listar }) {
    const [editMode, setEditMode] = useState(false);
    const [texto, setTexto] = useState(observaciones || "");
    const {user} = useAuth();
    const notyf = useRef(new Notyf({
            duration: 10000,
            dismissible: true,
            position: { x: 'center', y: 'top' },
        }));
    const handleGuardar = async () => {
        if (idContrato) {
            setLoading(true)
            try {
                const data = { idContrato: idContrato, observaciones: texto };
                await actualizarobservaciones(data);
                notyf.current.success("Observaciones Actulizados")
                listar()
            } catch (error) {
                notyf.current.error("error al actualizar observacione")    
            }finally
            {
                setLoading(false)
            }
        }
        setEditMode(false);
    };

    const handleCerrar = () => {
        setEditMode(false);
        setTexto(observaciones || "");
        setIsOpen(false);
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleCerrar}>
                {/* Fondo semitransparente */}
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-50"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-50"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-full p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg text-left">
                                <DialogTitle className="text-lg font-semibold text-gray-900">
                                    Observaciones
                                </DialogTitle>

                                <div className="mt-4 text-gray-700 max-h-64 overflow-y-auto">
                                    {editMode ? (
                                        <textarea
                                            className="w-full h-40 p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                                            value={texto}
                                            onChange={(e) => setTexto(e.target.value)}
                                        />
                                    ) : (
                                        <p className="text-sm whitespace-pre-line">{texto || "No hay observaciones."}</p>
                                    )}
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    {editMode ? (
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-indigo-50 text-gray-700 border border-indigo-200 rounded-md hover:bg-indigo-100 transition"
                                            onClick={handleGuardar}
                                        >
                                            Guardar
                                        </button>
                                    ) : (
                                        
                                            user?.rol ==="admin"&&(<button
                                                type="button"
                                                className="px-4 py-2 bg-gray-50 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                                                onClick={() => setEditMode(true)}
                                            >
                                                Editar
                                            </button>)
                                        
                                    )}

                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-50 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                                        onClick={handleCerrar}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default ModalObservaciones;
