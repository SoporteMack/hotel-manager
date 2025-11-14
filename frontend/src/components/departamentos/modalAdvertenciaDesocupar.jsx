import { Dialog, DialogPanel, DialogBackdrop, DialogTitle, Description } from "@headlessui/react";

export default function ModalAdvertencia({ isOpen, onClose, departamento, setCambio }) {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            as="div"
            className="relative z-50"
        >
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/40 backdrop-blur-sm duration-300 data-[closed]:opacity-0"
            />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel
                    transition
                    className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl transform transition-all duration-300"
                >
                    <DialogTitle className="text-xl font-bold text-red-600">
                        ⚠️ Advertencia
                    </DialogTitle>

                    <Description className="mt-3 text-gray-700">
                        Si el inquilino <span className="font-semibold">desocupa el departamento</span>,
                        el contrato actual será dado por terminado.
                        <br />¿Deseas continuar?
                    </Description>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={() => {
                                setCambio(true);   // Marca que podemos aplicar
                                onClose();
                            }}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                        >
                            Sí, terminar contrato
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
