import axios from "axios";
import { useEffect, useState } from "react"
import { Pencil, Paperclip } from "lucide-react";
import ModalAgregarDocs from "./modalAgregarDocs";
function ItemTablaContrato({ item, setLoading, setIsOpen, setContrato,listar }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const baseurl = "/api/documentos/obtenertarjetas"
  const [base, setbase] = useState("");
  const [modalAddDoc, setModalAddDoc] = useState(false);
  const [partes,setPartes] = useState([])
  useEffect(() => {
    const ruta = item.INED;
    setPartes(ruta.replace(/\\/g, "/").split("/"));
    partes.pop(); // Elimina la última parte
    const rutaSinArchivo = partes.join("/");

    setbase(rutaSinArchivo)
  }, [])
  const handleDescargartarjetas = async (img, img2) => {
    const ineaD = img.replace(/\\/g, "/").split("/").pop();
    const ineaA = img2.replace(/\\/g, "/").split("/").pop();

    const ruta = apiUrl + baseurl + base + "/" + ineaD + "/" + ineaA;
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  };
  const handleDescargarComprobante = async () => {
    const img = item.comprobanteDeDomicilio.replace(/\\/g, "/").split("/").pop();
    const ruta = base + "/" + img;
    const url = apiUrl + `/api/documentos/obtenercomprobante${ruta}`;
    setLoading(true);

    try {
      const response = await axios.get(url, { responseType: "blob" });

      // Quitar extensión original y reemplazar por .pdf
      let filename = img.replace(/\.[^/.]+$/, "") + ".pdf";

      // Si el backend manda filename, úsalo
      const disposition = response.headers["content-disposition"];
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "");
      }

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = window.URL.createObjectURL(file);

      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", filename);
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


  const handleDescargarContrato = async (idContrato,carpeta) => {
    const url = apiUrl + "/api/documentos/contrato";
    setLoading(true)
    try {
      const response = await axios.get(url, {
        params: { idContrato, carpeta},
        responseType: "blob", // recibir PDF como blob
      });
      console.log(response)
      // Aseguramos tipo MIME del PDF
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Crear URL temporal para el blob
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = "contrato_final.pdf"; // nombre del archivo
      document.body.appendChild(link);
      link.click();

      // Limpiar recursos
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error("Error al descargar el contrato:", error);
    } finally { setLoading(false) }
  };

  const handleEditar = (contrato) => {
    setContrato(contrato)
    setIsOpen(true);
  }
  const handleAgregarDoc = async (item) => {
    setModalAddDoc(true);
  }
  return (
    <>
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
          <button
            onClick={item.comprobanteDeDomicilio ? handleDescargarComprobante : undefined}
            className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md transition
    ${!item.comprobanteDeDomicilio
                ? "text-gray-400 border-gray-300 bg-gray-200 cursor-not-allowed"
                : "text-indigo-600 border-indigo-200 hover:bg-indigo-50 cursor-pointer"
              }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" />
            </svg>
            Comprobante
          </button>

        </td>
        <td className="px-3 py-2 whitespace-nowrap">
          <span
            onClick={item.tarjetaA ? () => handleDescargartarjetas(item.tarjetaD, item.tarjetaA) : undefined}
            className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md transition
    ${!item.tarjetaA
                ? "text-gray-400 border-gray-300 bg-gray-200 cursor-not-allowed"
                : "text-indigo-600 border-indigo-200 hover:bg-indigo-50 cursor-pointer"
              }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" />
            </svg>
            Tarjeta
          </span>

        </td>
        <td className="px-3 py-2 whitespace-nowrap">
          <button onClick={() => handleDescargarContrato(item.idContrato,partes[2])} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50 cursor-pointer transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" />
            </svg>
            Contrato
          </button>
        </td>
        <td className="px-3 py-2 whitespace-nowrap">
          <button className={`inline-block px-2 py-1 text-xs rounded-full  ${item.estatus ? 'bg-green-100 text-green-700' : 'bg-green-100 text-red-700'}`}>
            {item.estatus ? 'Activo' : 'Inactivo'}
          </button>

        </td>


        <td className="px-3 py-2 whitespace-nowrap text-right space-x-2">
          <button
            onClick={() => handleEditar(item)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
          >
            <Pencil size={16} />
            Editar
          </button>
          <button
            onClick={handleAgregarDoc}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
          >
            <Paperclip size={16} />
            Agregar Doc
          </button>
        </td>


      </tr>
      <ModalAgregarDocs isOpen={modalAddDoc} setIsOpen={setModalAddDoc} item={item} listar={listar} />
    </>
  )
}
function ItemCardContratoMobile({ item, setLoading, setIsOpen, setContrato }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const baseurl = "/api/documentos/obtenertarjetas"
  const [base, setBase] = useState("");
  const [modalAddDoc, setModalAddDoc] = useState(false);
  useEffect(() => {
    const ruta = item.INED;
    const partes = ruta.replace(/\\/g, "/").split("/");
    partes.pop();
    setBase(partes.join("/"));
  }, []);

  const handleDescargartarjetas = async (img, img2) => {
    const ineaD = img.replace(/\\/g, "/").split("/").pop();
    const ineaA = img2.replace(/\\/g, "/").split("/").pop();

    const ruta = apiUrl + baseurl + base + "/" + ineaD + "/" + ineaA;
    setLoading(true)
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
    } finally { setLoading(false) }
  };

  const handleDescargarComprobante = async () => {
    const img = item.comprobanteDeDomicilio.replace(/\\/g, "/").split("/").pop();
    const ruta = base + "/" + img;
    const url = apiUrl + `/api/documentos/obtenercomprobante${ruta}`;
    setLoading(true)
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
    } finally { setLoading(false) }
  }

  const handleEditar = async (contrato) => {
    setContrato(contrato)
    setIsOpen(true);
  }
  const handleDescargarContrato = async (idContrato) => {
    const url = apiUrl + "/api/documentos/contrato";
    setLoading(true)
    try {
      const response = await axios.get(url, {
        params: { idContrato },
        responseType: "blob", // recibir PDF como blob
      });
      console.log(response)
      // Aseguramos tipo MIME del PDF
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Crear URL temporal para el blob
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = "contrato_final.pdf"; // nombre del archivo
      document.body.appendChild(link);
      link.click();

      // Limpiar recursos
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error("Error al descargar el contrato:", error);
    } finally { setLoading(false) }
  };
  const handleAgregarDoc = async (item) => {
    setModalAddDoc(true);
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
          disabled={!item.tarjetaA} // se bloquea si tarjetaA es nulo o undefined
          className={`flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md transition
          ${!item.tarjetaA
              ? "text-gray-400 bg-gray-200 border-gray-300 cursor-not-allowed"
              : "text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
            }`}
        >
          <DownloadIcon />
          Tarjeta
        </button>

        <button
          onClick={handleDescargarComprobante}
          disabled={!item.comprobante} // se bloquea si no hay comprobante
          className={`flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md transition
    ${!item.comprobante
              ? "text-gray-400 bg-gray-200 border-gray-300 cursor-not-allowed"
              : "text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
            }`}
        >
          <DownloadIcon />
          Comprobante
        </button>

        <button
          onClick={() => handleDescargarContrato(item.idContrato)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition"
        >
          <DownloadIcon />
          Contrato
        </button>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => handleEditar(item)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
        >
          <Pencil size={16} />
          Editar
        </button>
       {!item.comprobanteDeDomicilio || !item.tarjetaA && ( <button
          onClick={handleAgregarDoc}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
        >
          <Paperclip size={16} />
          Agregar Doc
        </button>)}
      </div>
      <ModalAgregarDocs isOpen={modalAddDoc} setIsOpen={setModalAddDoc} item={item} />
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