import { useEffect, useState, useRef } from "react";
import Camara from "./camara";
import { listaActivosInquilinos } from "../../api/Inquilinos";
import { departamentosactivos } from "../../api/departamentos";
import Lista from "../items/lista";
import { crearContrato } from "../../api/contratos";
import { Notyf } from "notyf";
import axios from "axios";

function CrearContrato() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const notyf = useRef(new Notyf({
    duration: 10000,
    dismissible: true,
    position: { x: 'center', y: 'top' },
  }));
  const [listaInquilinos, setListaInquilinos] = useState([]);
  const [listaDepartamentos, setListaDepartamentos] = useState([]);
  const [inquilinos, setInquilinos] = useState(null);
  const [departamento, setDepartamento] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaTermino, setFechaTermino] = useState("");
  const [deposito, setDeposito] = useState(0);
  const [estatus, setEstatus] = useState(true);
  const [mostrarCamaraPara, setMostrarCamaraPara] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [docs, setDocs] = useState({
    ineD: useRef(null),
    ineA: useRef(null),
    comprobatededomicilio: useRef(null),
    tarjetaD: useRef(null),
    tarjetaA: useRef(null),
  });

  // Función para cargar listas de inquilinos y departamentos
  const cargarListas = async () => {
    try {
      const [resInq, resDeptos] = await Promise.all([
        listaActivosInquilinos(),
        departamentosactivos(),
      ]);
      setListaInquilinos(
        resInq.data.lista.map((i) => ({
          value: i.idPersona,
          label: `${i.nombrePersona} ${i.apellidoPaterno} ${i.apellidoMaterno}`,
        }))
      );
      setListaDepartamentos(
        resDeptos.data.lista.map((d) => ({
          value: d.numDepartamento,
          label: d.descripcion,
        }))
      );
    } catch (error) {
      notyf.current.error("error al cargar los datos");
    }
  };

  useEffect(() => {
    cargarListas();
  }, []);

  const handleFileChange = (e, tipo) => {
    const file = e.target.files[0];
    if (file) setDocs((prev) => ({ ...prev, [tipo]: file }));
  };

  const handleCaptura = (imagenBase64) => {
    const blob = dataURLtoBlob(imagenBase64);
    const archivo = new File([blob], `${mostrarCamaraPara}.jpg`, { type: "image/jpeg" });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inquilinos || !departamento || !fechaInicio || !fechaTermino || deposito <= 0) {
      notyf.current.error("valores no validos para crear contrato")
      return;
    }
    const formData = new FormData();
    formData.append("idPersona", inquilinos);
    formData.append("numDepartamento", departamento);
    formData.append("fechaInicio", fechaInicio);
    formData.append("fechaTermino", fechaTermino);
    formData.append("estatus", estatus);
    formData.append("deposito",deposito);

    Object.entries(docs).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });
    setLoading(true);
    try {
      const res = await crearContrato(formData).then(res => { return res.data });
      const idContrato = res.idContrato;
      await handleDescargarContrato(idContrato);
      // Limpiar formulario
      setInquilinos(null);
      setDepartamento(null);
      setFechaInicio("");
      setFechaTermino("");
      setEstatus(true);
      setDocs({
        ineD: null,
        ineA: null,
        comprobatededomicilio: null,
        tarjetaD: null,
        tarjetaA: null,
      });

      // Actualizar listas de departamentos y inquilinos
      await cargarListas();

      notyf.current.success(res.msg)

    } catch (error) {
      console.log(error);
      alert("Error al guardar contrato");
    }
    finally {
      setLoading(false);
    }
  };

  const camposDocumentos = [
    { nombre: "ineD", label: "INE parte delatera" },
    { nombre: "ineA", label: "INE parte Treasera" },
    { nombre: "comprobatededomicilio", label: "Comprobante de domicilio" },
    { nombre: "tarjetaD", label: "Tarjeta de trabajo o estudiante parte delantera" },
    { nombre: "tarjetaA", label: "Tarjeta de trabajo o estudiante parte trasera" }
  ];

  const handleDescargarContrato = async (idContrato) => {
    const url = apiUrl + "/api/documentos/generarcontrato";

    try {
      const response = await axios.get(url, {
        params: { idContrato },
        responseType: "blob", // recibir PDF como blob
      });
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
    }
  };
  return (

    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md flex flex-col items-center gap-3">
            <div className="loader border-4 border-t-4 border-gray-200 border-t-green-500 rounded-full w-12 h-12 animate-spin"></div>
            <span className="text-gray-700 font-medium">Guardando contrato...</span>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold text-center mb-4">Nuevo Contrato</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Inquilino y Departamento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Persona *</label>
            <Lista options={listaInquilinos} value={inquilinos} onChange={setInquilinos} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
            <Lista options={listaDepartamentos} value={departamento} onChange={setDepartamento} />
          </div>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio *</label>
            <input
              type="date"
              className="w-full p-2 border rounded-md"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha término *</label>
            <input
              type="date"
              className="w-full p-2 border rounded-md"
              value={fechaTermino}
              onChange={(e) => setFechaTermino(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Deposito</label>
          <input
            type="number"
            className="w-full p-2 border rounded-md text-2xl"
            value={deposito}
            onChange={(e) => setDeposito(e.target.value)}
            required
          />

        </div>
        {/* Estatus */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={estatus}
            onChange={(e) => setEstatus(e.target.checked)}
            className="h-4 w-4"
          />
          <label className="text-sm">Contrato activo</label>
        </div>

        {/* Documentos */}
        <div className="space-y-4">
          {camposDocumentos.map((campo) => (
            <div key={campo.nombre} className="border rounded-md p-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">{campo.label}</label>

              <div className="flex flex-col sm:flex-row gap-3 items-start">
                <input
                  type="file"
                  accept=".png,.jpg,.jpge "
                  onChange={(e) => handleFileChange(e, campo.nombre)}
                  className="text-sm"
                />

                <button
                  type="button"
                  onClick={() => {
                    setMostrarCamaraPara(campo.nombre);
                    setMostrarModal(true);
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Usar cámara
                </button>
              </div>

              {docs[campo.nombre] && (
                <div className="mt-3 w-full max-w-xs border rounded overflow-hidden">
                  {docs[campo.nombre].type?.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(docs[campo.nombre])}
                      alt={campo.label}
                      className="w-full h-40 object-contain"
                      onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                    />
                  ) : (
                    <div className="p-2 text-sm text-center text-gray-600">
                      {docs[campo.nombre].name}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700"
        >
          Guardar contrato
        </button>
      </form>

      {/* Modal de cámara */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Capturar {mostrarCamaraPara}</h3>
              <button onClick={() => setMostrarModal(false)} className="text-gray-600 hover:text-gray-800">
                ✕
              </button>
            </div>
            <div className="p-2">
              <Camara onCapturar={handleCaptura} />
            </div>
            <div className="p-4 border-t text-right">
              <button
                onClick={() => setMostrarModal(false)}
                className="text-sm text-red-600 hover:underline"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CrearContrato;
