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
  return (<div className="grid gap-3">
    {isLoagind && ( <Loader msg={"Guardando"}/>)}
    {items.map((persona) => (
      <div
        key={persona.idPersona}
        className="border rounded-xl p-4 shadow-sm bg-white flex flex-col"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-base font-semibold text-gray-800">
            {persona.nombre} {persona.apellido}
          </h3>
          <span className="text-xs text-gray-500">ID: {persona.idPersona}</span>
        </div>

        {user.rol === "admin" && (<div className="mt-3 flex justify-end">
          
           {/* Botón Editar */}
           {user.rol ==="admin"&&(<button
                  onClick={() => onEditar(persona)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg 
               text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  <Edit3 size={14} />
                  <span>Editar</span>
                </button>)}

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
        </div>)}
      </div>
    ))}
    {persona && (<ModalAgregarDocs isOpen={isOpen} setIsOpen={setIsOpen} item={persona} listar={listar} />)}
  </div>)

}
export default TarjetaPersonaPension;