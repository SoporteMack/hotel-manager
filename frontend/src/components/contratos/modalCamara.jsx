import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import Camara from "./camara";

export default function ModalCamara({ isOpen, onClose,handleCapturar}) {
   
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50 w-full h-full">
      <DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-6">
        <DialogPanel className="w-full max-w-sm sm:max-w-md rounded-lg bg-white p-6 shadow-md">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
            Capturar imagen
          </DialogTitle>

          <div className="w-full h-64 sm:h-80 bg-gray-100 rounded-lg overflow-hidden mb-4">
            <Camara  onCapturar={handleCapturar}/>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
            >
              Cancelar
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
