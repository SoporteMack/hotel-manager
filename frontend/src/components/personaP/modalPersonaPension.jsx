import { useState, useEffect, useRef } from "react";
import Camara from "../contratos/camara";

function ModalPersonaPension({ visible, onClose, onGuardar, item }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mostrarCamaraPara, setMostrarCamaraPara] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [docs, setDocs] = useState({});

  const handleFileChange = (e, tipo) => {
    const file = e.target.files[0];
    if (file) setDocs((prev) => ({ ...prev, [tipo]: file }));
  };

  const handleCaptura = (imagenBase64) => {
    const blob = dataURLtoBlob(imagenBase64);
    const archivo = new File([blob], `${mostrarCamaraPara}.jpg`, {
      type: "image/jpeg",
    });
    setDocs((prev) => ({ ...prev, [mostrarCamaraPara]: archivo }));
    setMostrarModal(false);
    setMostrarCamaraPara(null);
  };

  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
    return new Blob([u8arr], { type: mime });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("apellido", apellido);
    formData.append("telefono", telefono);

    Object.entries(docs).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    onGuardar(formData);
  };

  const camposDocumentos = [
    { nombre: "ineD", label: "INE parte delantera" },
    { nombre: "ineA", label: "INE parte trasera" },
  ];

  if (!visible) return null;

  return (
    <>
      {/* Fondo oscuro */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        {/* Contenedor del modal */}
        <div
          className="bg-white rounded-xl w-full max-w-md sm:max-w-lg lg:max-w-xl
                     max-h-[90vh] overflow-y-auto shadow-2xl relative
                     animate-in slide-in-from-bottom-4 duration-300"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {item ? "Editar Persona" : "Nueva Persona"}
              </h2>
              <button
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                onClick={onClose}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Contenido scrollable */}
          <div className="px-4 py-4 sm:px-6 sm:py-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campos básicos */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ingrese el nombre"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ingrese el apellido"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Número de teléfono"
                  />
                </div>
              </div>

              {/* Documentos */}
              <div className="border-t border-gray-200 pt-5">
                <h3 className="text-base font-medium text-gray-900 mb-4">
                  Documentos de Identificación
                </h3>
                <div className="space-y-4">
                  {camposDocumentos.map((campo) => (
                    <div
                      key={campo.nombre}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {campo.label}
                      </label>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) => handleFileChange(e, campo.nombre)}
                          className="w-full text-xs sm:text-sm file:mr-2 file:py-1.5 file:px-3 
                                     file:rounded-md file:border-0 file:text-xs file:font-medium
                                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            setMostrarCamaraPara(campo.nombre);
                            setMostrarModal(true);
                          }}
                          className="flex items-center justify-center gap-2 px-3 py-2 
                                     bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium
                                     hover:bg-blue-700 transition-colors"
                        >
                          📷 Cámara
                        </button>
                      </div>

                      {/* Preview */}
                      {docs[campo.nombre] && (
                        <div className="mt-3 border rounded-lg overflow-hidden bg-white">
                          <img
                            src={URL.createObjectURL(docs[campo.nombre])}
                            alt={campo.label}
                            className="w-full h-32 object-contain bg-gray-50"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg 
                           text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg 
                           text-sm font-medium hover:bg-blue-700"
                >
                  {item ? "Actualizar Persona" : "Guardar Persona"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal cámara */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-2">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                📷 Capturar {camposDocumentos.find((c) => c.nombre === mostrarCamaraPara)?.label}
              </h3>
              <button
                onClick={() => setMostrarModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full"
              >
                ✖
              </button>
            </div>

            <div className="p-2 sm:p-4 bg-gray-900">
              <Camara onCapturar={handleCaptura} />
            </div>

            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-center">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
              >
                Cancelar captura
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ModalPersonaPension;
