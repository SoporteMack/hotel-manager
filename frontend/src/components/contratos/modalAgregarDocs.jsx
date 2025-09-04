import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { Home, IdCard } from "lucide-react";
import ModalComprobante from "./modalComprobante";

export default function ModalAgregarDocs({ isOpen, setIsOpen, item,listar}) {
  const [comprobante,setComprobante] = useState(false); 
  const onClose = ()=>{
    setIsOpen(false)
  }
  return (
    <>
      {/* Modal principal */}
      <Dialog open={isOpen && !comprobante} onClose={() => setIsOpen(false)} className="relative z-50 w-full h-full" as="div">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-6">
          <DialogPanel className="w-full max-w-sm sm:max-w-md rounded-lg bg-white p-4 sm:p-6 shadow-xl">
            <DialogTitle className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
              Selecciona el tipo de documento
            </DialogTitle>
            <div className="flex flex-col gap-3">
            {!item.comprobanteDeDomicilio && (  <button
                onClick={() => setComprobante(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                <Home size={18} />
                Comprobante de domicilio
              </button>)}
              <button
                onClick={() => setModalType("estudiante")}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                <IdCard size={18} />
                Tarjeta de estudiante
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <ModalComprobante isOpen={comprobante} setIsOpen={setComprobante} item={item} onClose={onClose} listar={listar}/>
    </>
  );
}
