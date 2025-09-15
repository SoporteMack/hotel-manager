import { Paperclip, FileDown, Edit3 } from "lucide-react";
import ModalAgregarDocs from "./modalAgregarDocs";
import { useState } from "react";
import axios from "axios";
function TablaPersonasPension({ items, onEditar, listar }) {
  const [persona, setPersona] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const onAgregarDoc = (persona) => {
    setPersona(persona)
    setIsOpen(true)
  }
  const handleDescargarIne = async (ine) => {
    const data = { url: ine }
    const apiUrl = import.meta.env.VITE_API_URL;
    const ruta = apiUrl + '/api/pension/personas/descargarine'
    try {
      const response = await axios.post(ruta, data, { responseType: "blob" });
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = window.URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `ine.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error("Error al descargar tarjeta:", error);
    } finally {
    }
  }
  const handleDescargarCom = async (com) => {
    const data = { url: com }
    const apiUrl = import.meta.env.VITE_API_URL;
    const ruta = apiUrl + '/api/pension/personas/descargarcom'
    try {
      const response = await axios.post(ruta, data, { responseType: "blob" });
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = window.URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `Comprobante.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error("Error al descargar tarjeta:", error);
    } finally {
    }
  }
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID Persona</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nombre</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Apellido</th>
            <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((persona) => (
            <tr key={persona.idPersona}>
              <td className="px-4 py-2 text-sm text-gray-600">{persona.idPersona}</td>
              <td className="px-4 py-2 text-sm text-gray-600">{persona.nombre}</td>
              <td className="px-4 py-2 text-sm text-gray-600">{persona.apellido}</td>

              <td className="px-4 py-2 text-center space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row justify-center items-center">
                {/* Botón Editar */}
                <button
                  onClick={() => onEditar(persona)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg 
               text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  <Edit3 size={14} />
                  <span>Editar</span>
                </button>

                {/* Botón Agregar Documentos (solo si faltan) */}
                {(!persona.comprobanteDeDomicilio || !persona.INE) && (
                  <button
                    onClick={() => onAgregarDoc(persona)}
                    className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg 
                 text-sm font-medium hover:bg-green-100 transition-colors"
                  >
                    <Paperclip size={14} />
                    <span>Agregar Doc</span>
                  </button>
                )}

                {/* Botón Descargar INE */}
                <button
                  onClick={() => handleDescargarIne(persona.INE)}
                  disabled={!persona.INE}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors 
               ${persona.INE
                      ? "bg-purple-50 text-purple-700 hover:bg-purple-100"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                >
                  <FileDown size={14} />
                  <span>INE</span>
                </button>

                {/* Botón Descargar Comprobante */}
                <button
                  onClick={() => handleDescargarCom(persona.comprobanteDeDomicilio)}
                  disabled={!persona.comprobanteDeDomicilio}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors 
               ${persona.comprobanteDeDomicilio
                      ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                >
                  <FileDown size={14} />
                  <span>Comprobante</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {persona && (<ModalAgregarDocs isOpen={isOpen} setIsOpen={setIsOpen} item={persona} listar={listar} />)}
    </div>

  );
}

export default TablaPersonasPension;
