import { useState, useEffect, useRef } from "react";
import Camara from "../contratos/camara";

function ModalPersonaPension({ onClose, onGuardar, item }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mostrarCamaraPara, setMostrarCamaraPara] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [docs, setDocs] = useState({});
  useEffect(() => {
    if (item) {
      setNombre(item.nombre || "");
      setApellido(item.apellido || "");
      setTelefono(item.telefono || "");
    }
  }, [item]);

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
    if (item)
      formData.append("idPersona", item.idPersona);

    Object.entries(docs).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    onGuardar(formData);
    setNombre("");
    setApellido("");
    setTelefono("");
    setDocs({})
  };

  const camposDocumentos = [
    { nombre: "ineD", label: "INE parte delantera" },
    { nombre: "ineA", label: "INE parte trasera" },
  ];


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
                    defaultValue={nombre}
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
                    defaultValue={apellido}
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
                    onChange={(e) => {
                      // Permite solo números y máximo 10 dígitos (puedes cambiarlo)
                      const valor = e.target.value.replace(/[^0-9]/g, "");
                      setTelefono(valor);
                    }}
                    maxLength={10} // limite de dígitos (ej: 10 para México)
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Número de teléfono"
                  />

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
    </>
  );
}

export default ModalPersonaPension;
