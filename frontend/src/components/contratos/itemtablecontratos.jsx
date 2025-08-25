import axios from "axios";
import { useEffect, useState } from "react"
function ItemTablaContrato({ item }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const baseurl = "/api/documentos/obtenertarjetas"
    const [base, setbase] = useState("");
    useEffect(() => {
        const ruta = item.INED;
        const partes = ruta.replace(/\\/g, "/").split("/");
        partes.pop(); // Elimina la última parte
        const rutaSinArchivo = partes.join("/");

        setbase(rutaSinArchivo)
    }, [])
    const handleDescargartarjetas = async (img, img2) => {
      const ineaD = img.replace(/\\/g, "/").split("/").pop();
      const ineaA = img2.replace(/\\/g, "/").split("/").pop();
    
      const ruta = apiUrl+baseurl+base + "/" + ineaD + "/" + ineaA;
    
      try {
        const response = await axios.get(ruta, {
          responseType: "blob", 
        });
  
        // Crear blob y URL
        const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = window.URL.createObjectURL(file);
    
        // Forzar descarga
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", `${ineaD}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    
        window.URL.revokeObjectURL(fileURL);
      } catch (error) {
        console.error("Error al descargar tarjeta:", error);
      }
    };
    const handleDescargarComprobante = async () => {
        const img = item.comprobanteDeDomicilio.replace(/\\/g, "/").split("/").pop();
        const ruta = base + "/" + img;
        const url = `api/documentos/obtenercomprobante${ruta}`;
        try {
          const response = await axios.get(url, {
            responseType: "blob", 
          });
      
          // Crear blob y URL
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = window.URL.createObjectURL(file);
      
          // Forzar descarga
          const link = document.createElement("a");
          link.href = fileURL;
          link.setAttribute("download", `${img}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.remove();
      
          window.URL.revokeObjectURL(fileURL);
        } catch (error) {
          console.error("Error al descargar tarjeta:", error);
        }
    }
    return (
        <tr className="border-t hover:bg-gray-50">
            <td className="px-3 py-1 whitespace-nowrap font-medium">{item.idContrato}</td>
            <td className="px-3 py-2 whitespace-nowrap">{`${item.persona.nombrePersona} ${item.persona.apellidoPaterno} ${item.persona.apellidoMaterno}`}</td>
            <td className="px-2 py-1 whitespace-nowrap">{item.departamento.descripcion}</td>
            <td className="px-3 py-2 whitespace-nowrap">
                <span onClick={() => handleDescargartarjetas(item.INED, item.INEA)} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50 cursor-pointer transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" />
                    </svg>
                    INE
                </span>

            </td>
            <td className="px-3 py-2 whitespace-nowrap">
                <span onClick={handleDescargarComprobante} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50 cursor-pointer transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" />
                    </svg>
                    Comprobante
                </span>
            </td>
            <td className="px-3 py-2 whitespace-nowrap">
                <span onClick={() => handleDescargartarjetas(item.tarjetaD, item.tarjetaA)} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50 cursor-pointer transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" />
                    </svg>
                    Tarjeta
                </span>
            </td>
            <td className="px-3 py-2 whitespace-nowrap">
                <span className={`inline-block px-2 py-1 text-xs rounded-full  ${item.estatus ? 'bg-green-100 text-green-700' : 'bg-green-100 text-red-700'}`}>
                    {item.estatus ? 'Activo' : 'Inactivo'}
                </span>

            </td>
            <td className="px-3 py-2 whitespace-nowrap text-right">
                <button className="text-yellow-600 hover:underline mr-3">Editar</button>
            </td>
        </tr>
    )
}
function ItemCardContratoMobile({ item, onEditar, onDelete }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const baseurl = "/api/documentos/obtenertarjetas"
  const [base, setBase] = useState("");
  
    useEffect(() => {
      const ruta = item.INED;
      const partes = ruta.replace(/\\/g, "/").split("/");
      partes.pop();
      setBase(partes.join("/"));
    }, []);
  
    const handleDescargartarjetas = async (img, img2) => {
      const ineaD = img.replace(/\\/g, "/").split("/").pop();
      const ineaA = img2.replace(/\\/g, "/").split("/").pop();
    
      const ruta = apiUrl+baseurl+base + "/" + ineaD + "/" + ineaA;
    
      try {
        const response = await axios.get(ruta, {
          responseType: "blob", 
        });
        // Crear blob y URL
        const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = window.URL.createObjectURL(file);
    
        // Forzar descarga
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", `${ineaD}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    
        window.URL.revokeObjectURL(fileURL);
      } catch (error) {
        console.error("Error al descargar tarjeta:", error);
      }
    };
  
    const handleDescargarComprobante = async () => {
      const img = item.comprobanteDeDomicilio.replace(/\\/g, "/").split("/").pop();
      const ruta = base + "/" + img;
      const url = `api/documentos/obtenercomprobante${ruta}`;
      try {
        const response = await axios.get(url, {
          responseType: "blob", 
        });
    
        // Crear blob y URL
        const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = window.URL.createObjectURL(file);
    
        // Forzar descarga
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", `${img}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    
        window.URL.revokeObjectURL(fileURL);
      } catch (error) {
        console.error("Error al descargar tarjeta:", error);
      }
  }
  
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-5 transition hover:shadow-md">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg text-gray-900">
            Contrato #{item.idContrato}
          </h3>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.estatus ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            {item.estatus ? 'Activo' : 'Inactivo'}
          </span>
        </div>
  
        <div className="text-sm text-gray-700 space-y-1 mb-4">
          <p>
            <span className="font-medium">Inquilino: </span>
            {`${item.persona.nombrePersona} ${item.persona.apellidoPaterno} ${item.persona.apellidoMaterno || ''}`}
          </p>
          <p>
            <span className="font-medium">Departamento: </span>
            {item.departamento?.descripcion}
          </p>
        </div>
  
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleDescargartarjetas(item.INED, item.INEA)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition"
          >
            <DownloadIcon />
            INE
          </button>
  
          <button
            onClick={() => handleDescargartarjetas(item.tarjetaD, item.tarjetaA)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition"
          >
            <DownloadIcon />
            Tarjeta
          </button>
  
          <button
            onClick={handleDescargarComprobante}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition"
          >
            <DownloadIcon />
            Comprobante
          </button>
        </div>
  
        <div className="flex justify-end gap-3">
          <button
            onClick={() =>{navigate(`/editarcontrato/`)}}
            className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-yellow-700 border border-yellow-300 rounded-md hover:bg-yellow-50 transition"
          >
            Editar
          </button>
        </div>
      </div>
    );
  }
  function DownloadIcon() {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" />
      </svg>
    );
  } 
export { ItemTablaContrato, ItemCardContratoMobile }