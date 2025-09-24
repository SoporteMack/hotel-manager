import { Paperclip, FileDown, Edit3 } from "lucide-react";
import ModalAgregarDocs from "./modalAgregarDocs";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import Loader from "../items/loader";

function TarjetaPersonaPension({ items, onEditar, listar }) {
  const [persona, setPersona] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoagind,setIsLoading] = useState(false);
  const { user } = useAuth();
  const onAgregarDoc = (persona) => {
    setPersona(persona)
    setIsOpen(true)
  }
  const handleDescargarIne = async (ine) => {
    const data = { url: ine }
    const apiUrl = import.meta.env.VITE_API_URL;
    const ruta = apiUrl + '/api/pension/personas/descargarine'
    setIsLoading(true)
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
      setIsLoading(false)
    }
  }
  const handleDescargarCom = async (com) => {
    const data = { url: com }
    const apiUrl = import.meta.env.VITE_API_URL;
    const ruta = apiUrl + '/api/pension/personas/descargarcom'
    setIsLoading(true)
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
      setIsLoading(false)
    }
  }
  return (<div className="grid gap-4">
    {isLoagind && <Loader msg="Guardando..." />}
    {items.map((persona) => (
      <div
        key={persona.idPersona}
        className="border rounded-2xl p-5 shadow-sm bg-white hover:shadow-lg transition flex flex-col gap-4"
      >
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {persona.nombre} {persona.apellido}
            </h3>
            <span className="text-xs text-gray-500">ID: {persona.idPersona}</span>
          </div>
        </div>
  
        {/* Datos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
          <p>
            <span className="font-medium">Teléfono:</span> {persona.telefono}
          </p>
          <p>
            <span className="font-medium">Teléfono 2:</span> {persona.telefono2}
          </p>
        </div>
  
        {/* Acciones */}
        {user.rol === "admin" && (
          <div className="flex flex-wrap gap-2 justify-end pt-2 border-t border-gray-100">
            {/* Editar */}
            <button
              onClick={() => onEditar(persona)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg 
                         text-sm font-medium hover:bg-blue-100 transition"
            >
              <Edit3 size={16} />
              Editar
            </button>
  
            {/* Agregar documentos */}
            {(!persona.comprobanteDeDomicilio || !persona.INE) && (
              <button
                onClick={() => onAgregarDoc(persona)}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg 
                           text-sm font-medium hover:bg-green-100 transition"
              >
                <Paperclip size={16} />
                Agregar Docs
              </button>
            )}
  
            {/* Descargar INE */}
            <button
              onClick={() => handleDescargarIne(persona.INE)}
              disabled={!persona.INE}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition
                ${
                  persona.INE
                    ? "bg-purple-50 text-purple-700 hover:bg-purple-100"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              <FileDown size={16} />
              INE
            </button>
  
            {/* Descargar Comprobante */}
            <button
              onClick={() => handleDescargarCom(persona.comprobanteDeDomicilio)}
              disabled={!persona.comprobanteDeDomicilio}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition
                ${
                  persona.comprobanteDeDomicilio
                    ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              <FileDown size={16} />
              Comprobante
            </button>
          </div>
        )}
      </div>
    ))}
  
    {persona && (
      <ModalAgregarDocs
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        item={persona}
        listar={listar}
      />
    )}
  </div>
  )

}
export default TarjetaPersonaPension;