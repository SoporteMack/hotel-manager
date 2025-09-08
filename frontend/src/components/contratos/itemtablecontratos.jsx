import axios from "axios";
import { useEffect, useState } from "react";
import { Pencil, Paperclip,Eye} from "lucide-react";
import ModalAgregarDocs from "./modalAgregarDocs";
import { useAuth } from "../../context/authContext";
import ModalObservaciones from "./modalObservaciones";

function ItemTablaContrato({ item, setLoading, setIsOpen, setContrato, listar }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const baseurl = "/api/documentos/obtenertarjetas";
  const [base, setBase] = useState("");
  const [partes, setPartes] = useState([]);
  const [modalAddDoc, setModalAddDoc] = useState(false);
  const [openObservaciones,setOpenObservaciones] = useState(false);
  const { user } = useAuth();

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

  const handleEditar = () => {
    setContrato(item);
    setIsOpen(true);
  };

  const handleAgregarDoc = () => setModalAddDoc(true);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-3">
      {/* Nombre y departamento */}
      <div className="flex flex-col">
        <span className="font-medium text-gray-800">
          {item.persona.nombrePersona} {item.persona.apellidoPaterno} {item.persona.apellidoMaterno}
        </span>
        <span className="text-gray-600 text-sm">{item.departamento?.descripcion}</span>
      </div>

      {/* Estatus */}
      <div>
        <span className={`px-2 py-0.5 text-xs rounded-full ${item.estatus ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {item.estatus ? "Activo" : "Inactivo"}
        </span>
      </div>

      {/* Documentos */}
      <div className="flex flex-col items-start space-y-2">
        <button
          onClick={() => handleDescargartarjetas(item.INED, item.INEA)}
          className="w-full text-left px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
        >
          INE
        </button>

        <button
          onClick={handleDescargarComprobante}
          className={`w-full text-left px-4 py-2 border rounded-md transition
      ${!item.comprobanteDeDomicilio
              ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
        >
          Comprobante
        </button>

        <button
          onClick={() => handleDescargartarjetas(item.tarjetaD, item.tarjetaA)}
          className={`w-full text-left px-4 py-2 border rounded-md transition
      ${!item.tarjetaA
              ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
        >
          Tarjeta
        </button>

        <button
          onClick={handleDescargarContrato}
          className="w-full text-left px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
        >
          Contrato
        </button>
      </div>


      {/* Acciones */}
      <div className="flex flex-col space-y-2">
        {user?.rol === "admin" && (
          <button onClick={handleEditar} className="btn-action flex items-center gap-1">
            <Pencil size={16} /> Editar
          </button>
        )}
        {(!item.comprobanteDeDomicilio || !item.tarjetaA) && (
          <button onClick={handleAgregarDoc} className="btn-action flex items-center gap-1">
            <Paperclip size={16} /> Agregar Doc
          </button>
        )}
        <button onClick={()=>{setOpenObservaciones(true)}} className="btn-action flex items-center gap-1">
            <Eye size={16}/> Ver Observacione
        </button>
      </div>
      <ModalAgregarDocs isOpen={modalAddDoc} setIsOpen={setModalAddDoc} item={item} listar={listar} />
      <ModalObservaciones isOpen={openObservaciones} setIsOpen={setOpenObservaciones} observaciones={item.observaciones} idContrato={item.idContrato} setLoading={setLoading} listar={listar}/>
    </div>
  );

}

export { ItemTablaContrato };
