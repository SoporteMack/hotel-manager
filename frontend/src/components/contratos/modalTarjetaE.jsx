import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogBackdrop,
  } from "@headlessui/react";
  import ModalCamara from "./modalCamara";
  import { useState, useEffect } from "react";
  import { subirTarjeta } from "../../api/contratos";
  
  export default function ModalTarjetaE({
    isOpen,
    setIsOpen,
    item,
    onClose,
    listar, // asegúrate de pasar esta función como prop
  }) {
    const [mostrarCamara, setMostrarCamara] = useState(false);
    const [mostrarCamaraD, setMostrarCamaraD] = useState(false);
    const [docs, setDocs] = useState({ tarjetaA: null, tarjetaD: null });
    const [idContrato, setIdContrato] = useState(null);
    const [idPersona, setIdPersona] = useState(null);
    const [numDepartamento, setNumDepartamento] = useState(null);
  
    useEffect(() => {
      if (item) {
        setIdContrato(item.idContrato);
        setIdPersona(item.idPersona);
        setNumDepartamento(item.numDepartamento);
      }
    }, [item]);
  
    const onclose = () => setMostrarCamara(false);
    const oncloseD = () => setMostrarCamaraD(false);
  
    const handleFileChange = (e, direccion) => {
      const file = e.target.files[0];
      if (file)
        setDocs((prev) => ({
          ...prev,
          [direccion]: file,
        }));
    };
  
    const handleCapturaA = (imagenBase64) => {
        const blob = dataURLtoBlob(imagenBase64);
        const archivo = new File([blob], "tarjetaA.jpg", { type: "image/jpeg" });
        setDocs(prev => ({ ...prev, tarjetaA: archivo }));  // ✅ mantiene tarjetaD si ya existe
        setMostrarCamara(false);
      };
      
      const handleCapturaD = (imagenBase64) => {
        const blob = dataURLtoBlob(imagenBase64);
        const archivo = new File([blob], "tarjetaD.jpg", { type: "image/jpeg" });
        setDocs(prev => ({ ...prev, tarjetaD: archivo }));  // ✅ mantiene tarjetaA si ya existe
        setMostrarCamaraD(false);
      };
  
    const dataURLtoBlob = (dataURL) => {
      const arr = dataURL.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      const u8arr = new Uint8Array(bstr.length);
      for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
      return new Blob([u8arr], { type: mime });
    };
  
    const handleGuardar = async () => {
      if (!docs.tarjetaA || !docs.tarjetaD)
        return alert("Debes subir ambas imágenes (frente y reverso).");
      try {
        const formData = new FormData();
        formData.append("idPersona", idPersona);
        formData.append("numDepartamento", numDepartamento);
        formData.append("idContrato", idContrato);
        formData.append("tarjetaA", docs.tarjetaA);
        formData.append("tarjetaD", docs.tarjetaD);
  
        // Debug
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
  
        const res = await subirTarjeta(formData);
        console.log(res.data);
        setIsOpen(false);
        if (listar) listar();
        onClose();
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50 w-full h-full"
        >
          <DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
          <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-6">
            <DialogPanel className="w-full max-w-sm sm:max-w-md rounded-lg bg-white p-6 shadow-md">
              <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
                Subir fotos de tarjeta
              </DialogTitle>
  
              {/* Frente */}
              <div className="flex flex-col gap-4 mb-6">
                <label className="block w-full cursor-pointer">
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={(e) => handleFileChange(e, "tarjetaA")}
                    className="hidden"
                  />
                  <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition">
                    Seleccionar archivo (Frente)
                  </div>
                </label>
  
                {docs.tarjetaA && (
                  <div className="mt-3 w-full max-w-xs border rounded overflow-hidden">
                    {docs.tarjetaA.type?.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(docs.tarjetaA)}
                        className="w-full h-40 object-contain"
                        onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                      />
                    ) : (
                      <div className="p-2 text-sm text-center text-gray-600">
                        {docs.tarjetaA.name}
                      </div>
                    )}
                  </div>
                )}
  
                <button
                  onClick={() => setMostrarCamara(true)}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Abrir cámara (Frente)
                </button>
              </div>
  
              {/* Reverso */}
              <div className="flex flex-col gap-4">
                <label className="block w-full cursor-pointer">
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={(e) => handleFileChange(e, "tarjetaD")}
                    className="hidden"
                  />
                  <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition">
                    Seleccionar archivo (Reverso)
                  </div>
                </label>
  
                {docs.tarjetaD && (
                  <div className="mt-3 w-full max-w-xs border rounded overflow-hidden">
                    {docs.tarjetaD.type?.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(docs.tarjetaD)}
                        className="w-full h-40 object-contain"
                        onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                      />
                    ) : (
                      <div className="p-2 text-sm text-center text-gray-600">
                        {docs.tarjetaD.name}
                      </div>
                    )}
                  </div>
                )}
  
                <button
                  onClick={() => setMostrarCamaraD(true)}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Abrir cámara (Reverso)
                </button>
              </div>
  
              {/* Acciones */}
              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardar}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-medium"
                >
                  Guardar
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
  
        {/* Modales de cámara */}
        <ModalCamara
          isOpen={mostrarCamara}
          onClose={onclose}
          handleCapturar={handleCapturaA}
        />
        <ModalCamara
          isOpen={mostrarCamaraD}
          onClose={oncloseD}
          handleCapturar={handleCapturaD}
        />
      </>
    );
  }
  