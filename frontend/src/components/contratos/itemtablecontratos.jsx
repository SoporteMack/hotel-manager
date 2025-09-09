// ItemTablaContrato.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { Pencil, Paperclip, Eye, Download, User, Building2 } from "lucide-react";

function ItemTablaContrato({ item, setLoading, user, onEditar, onAgregarDoc, onVerObservaciones, viewMode = "desktop" }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const baseurl = "/api/documentos/obtenertarjetas";
  const [base, setBase] = useState("");
  const [partes, setPartes] = useState([]);

  useEffect(() => {
    if (item.INED) {
      const arr = item.INED.replace(/\\/g, "/").split("/");
      arr.pop();
      setPartes(arr);
      setBase(arr.join("/"));
    }
  }, [item.INED]);

  const handleDescargartarjetas = async (img, img2) => {
    const ineaD = img.replace(/\\/g, "/").split("/").pop();
    const ineaA = img2.replace(/\\/g, "/").split("/").pop();
    const ruta = `${apiUrl}${baseurl}/${partes[1]}/${partes[2]}/${ineaD}/${ineaA}`;
    setLoading(true);
    try {
      const response = await axios.get(ruta, { responseType: "blob" });
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = window.URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `${ineaD}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error("Error al descargar tarjeta:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarComprobante = async () => {
    if (!item.comprobanteDeDomicilio) return;
    const img = item.comprobanteDeDomicilio.replace(/\\/g, "/").split("/").pop();
    const url = `${apiUrl}/api/documentos/obtenercomprobante/${partes[1]}/${partes[2]}/${img}`;
    setLoading(true);
    try {
      const response = await axios.get(url, { responseType: "blob" });
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = window.URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `${img}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error("Error al descargar comprobante:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarContrato = async () => {
    const url = `${apiUrl}/api/documentos/contrato`;
    setLoading(true);
    try {
      const response = await axios.get(url, {
        params: { idContrato: item.idContrato, carpeta: partes[2] },
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = "contrato_final.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error("Error al descargar contrato:", error);
    } finally {
      setLoading(false);
    }
  };

  // Vista Desktop (Tabla)
  if (viewMode === "desktop") {
    return (
      <tr className="hover:bg-gray-50 transition-colors duration-200">
        {/* Nombre */}
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            
            <div>
              <div className="font-medium text-gray-900">
                {item.persona.nombrePersona} {item.persona.apellidoPaterno}
              </div>
              <div className="text-sm text-gray-500">{item.persona.apellidoMaterno}</div>
            </div>
          </div>
        </td>

        {/* Departamento */}
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 text-sm">{item.departamento?.descripcion}</span>
          </div>
        </td>

        {/* Estatus */}
        <td className="px-6 py-4 text-center">
          <span
            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
              item.estatus
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            <span className={`w-2 h-2 rounded-full mr-2 ${item.estatus ? "bg-green-500" : "bg-red-500"}`}></span>
            {item.estatus ? "Activo" : "Inactivo"}
          </span>
        </td>

        {/* Documentos */}
        <td className="px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => handleDescargartarjetas(item.INED, item.INEA)}
              className="inline-flex items-center px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors border border-blue-200"
            >
              <Download className="w-3 h-3 mr-1" />
              INE
            </button>

            <button
              onClick={handleDescargarComprobante}
              className={`inline-flex items-center px-3 py-1.5 text-xs rounded-md transition-colors border ${
                !item.comprobanteDeDomicilio
                  ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
              }`}
              disabled={!item.comprobanteDeDomicilio}
            >
              <Download className="w-3 h-3 mr-1" />
              Comprobante
            </button>

            <button
              onClick={() => handleDescargartarjetas(item.tarjetaD, item.tarjetaA)}
              className={`inline-flex items-center px-3 py-1.5 text-xs rounded-md transition-colors border ${
                !item.tarjetaA
                  ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
              }`}
              disabled={!item.tarjetaA}
            >
              <Download className="w-3 h-3 mr-1" />
              Tarjeta
            </button>

            <button
              onClick={handleDescargarContrato}
              className="inline-flex items-center px-3 py-1.5 text-xs bg-orange-50 text-orange-700 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
            >
              <Download className="w-3 h-3 mr-1" />
              Contrato
            </button>
          </div>
        </td>

        {/* Acciones */}
        <td className="px-6 py-4">
          <div className="flex gap-2 justify-center">
            {user?.rol === "admin" && (
              <button
                onClick={onEditar}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
              >
                <Pencil size={12} /> Editar
              </button>
            )}
            {(!item.comprobanteDeDomicilio || !item.tarjetaA) && (
              <button
                onClick={onAgregarDoc}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
              >
                <Paperclip size={12} /> Agregar
              </button>
            )}
            <button
              onClick={onVerObservaciones}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-50 text-gray-700 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Eye size={12} /> Ver
            </button>
          </div>
        </td>
      </tr>
    );
  }

  // Vista Mobile (Card)
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Header de la card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {item.persona.nombrePersona} {item.persona.apellidoPaterno}
              </h3>
              <p className="text-xs text-gray-600">{item.persona.apellidoMaterno}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
              item.estatus
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full mr-1 ${item.estatus ? "bg-green-500" : "bg-red-500"}`}></span>
            {item.estatus ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

      {/* Contenido de la card */}
      <div className="p-4 space-y-4">
        {/* Departamento */}
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-700">{item.departamento?.descripcion}</span>
        </div>

        {/* Documentos */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Documentos</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDescargartarjetas(item.INED, item.INEA)}
              className="flex items-center justify-center space-x-2 py-2 px-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>INE</span>
            </button>

            <button
              onClick={handleDescargarComprobante}
              className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                !item.comprobanteDeDomicilio
                  ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
              disabled={!item.comprobanteDeDomicilio}
            >
              <Download className="w-4 h-4" />
              <span>Comprobante</span>
            </button>

            <button
              onClick={() => handleDescargartarjetas(item.tarjetaD, item.tarjetaA)}
              className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                !item.tarjetaA
                  ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                  : "bg-purple-50 text-purple-700 hover:bg-purple-100"
              }`}
              disabled={!item.tarjetaA}
            >
              <Download className="w-4 h-4" />
              <span>Tarjeta</span>
            </button>

            <button
              onClick={handleDescargarContrato}
              className="flex items-center justify-center space-x-2 py-2 px-3 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Contrato</span>
            </button>
          </div>
        </div>

        {/* Acciones */}
        <div className="border-t border-gray-100 pt-3">
          <div className="flex flex-wrap gap-2">
            {user?.rol === "admin" && (
              <button
                onClick={onEditar}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex-1"
              >
                <Pencil size={14} />
                <span>Editar</span>
              </button>
            )}
            {(!item.comprobanteDeDomicilio || !item.tarjetaA) && (
              <button
                onClick={onAgregarDoc}
                className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex-1"
              >
                <Paperclip size={14} />
                <span>Agregar Doc</span>
              </button>
            )}
            <button
              onClick={onVerObservaciones}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex-1"
            >
              <Eye size={14} />
              <span>Ver Obs.</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ItemTablaContrato };