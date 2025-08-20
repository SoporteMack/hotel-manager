import { useEffect, useState, useRef } from "react";
import { config as lconfig,actualizarConfiguracion } from "../../api/config";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

function Configuracion() {
  const notyf = useRef(new Notyf({
    duration: 7000,
    dismissible: true,
    position: { x: "center", y: "top" },
  }));

  const [config, setConfig] = useState({
    telefonoActual:"",
    telefono: "",
    horaRepDiario: "",
    numCuenta: "",
    banco: "",
    titular: "",
  });

  const [loading, setLoading] = useState(false);

  // Para controlar errores simples de validación
  const [errores, setErrores] = useState({});

  // Cargar configuración desde API al montar
  useEffect(() => {
    const cargarConfig = async () => {
      setLoading(true);
      try {
        const res = await lconfig().then(res =>{return res.data[0]});
	const nuevores = {...res,telefonoActual:res.telefono};
        if (res) setConfig(nuevores);
      } catch (error) {
        notyf.current.error("Error al cargar configuración");
      } finally {
        setLoading(false);
      }
    };

    cargarConfig();
  }, []);

  // Validar campos antes de enviar
  const validar = () => {
    const errs = {};
    if (!config.telefono || !/^\d{10,15}$/.test(config.telefono)) {
      errs.telefono = "Teléfono debe tener entre 10 y 15 dígitos numéricos";
    }
    if (!config.horaRepDiario ||  !/^([01]\d|2[0-3]|[0-9])$/.test(config.horaRepDiario)) {
      errs.horaRepDiario = "Hora debe estar en formato  (24h)";
    }
    if (!config.numCuenta || !/^\d{10,20}$/.test(config.numCuenta)) {
      errs.numCuenta = "Número de cuenta debe tener entre 10 y 20 dígitos";
    }
    if (!config.banco) {
      errs.banco = "Banco es obligatorio";
    }
    if (!config.titular) {
      errs.titular = "Titular es obligatorio";
    }
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setConfig(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) {
      notyf.current.error("Corrige los errores antes de guardar");
      return;
    }

    setLoading(true);
    try {
      await actualizarConfiguracion(config);
      notyf.current.success("Configuración actualizada correctamente");
    } catch (error) {
      notyf.current.error("Error al actualizar configuración");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Configuración</h1>

      {loading && <p className="mb-4 text-center text-gray-600">Cargando...</p>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="telefono" className="block font-medium mb-1">Teléfono</label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            value={config.telefono}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${errores.telefono ? "border-red-500" : "border-gray-300"}`}
            placeholder="Ej. 5512345678"
          />
          {errores.telefono && <p className="text-red-500 text-sm mt-1">{errores.telefono}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="horaRepDiario" className="block font-medium mb-1">Hora de reporte diario (HH:mm)</label>
          <input
            type="number"
            min={0}
            max={23}
            id="horaRepDiario"
            name="horaRepDiario"
            value={config.horaRepDiario}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${errores.horaRepDiario ? "border-red-500" : "border-gray-300"}`}
          />
          {errores.horaRepDiario && <p className="text-red-500 text-sm mt-1">{errores.horaRepDiario}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="numCuenta" className="block font-medium mb-1">Número de cuenta</label>
          <input
            type="text"
            id="numCuenta"
            name="numCuenta"
            value={config.numCuenta}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${errores.numCuenta ? "border-red-500" : "border-gray-300"}`}
            placeholder="Ej. 1234567890123456"
          />
          {errores.numCuenta && <p className="text-red-500 text-sm mt-1">{errores.numCuenta}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="banco" className="block font-medium mb-1">Banco</label>
          <input
            type="text"
            id="banco"
            name="banco"
            value={config.banco}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${errores.banco ? "border-red-500" : "border-gray-300"}`}
            placeholder="Ej. Banco Azteca"
          />
          {errores.banco && <p className="text-red-500 text-sm mt-1">{errores.banco}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="titular" className="block font-medium mb-1">Titular</label>
          <input
            type="text"
            id="titular"
            name="titular"
            value={config.titular}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${errores.titular ? "border-red-500" : "border-gray-300"}`}
            placeholder="Ej. Juan Pérez"
          />
          {errores.titular && <p className="text-red-500 text-sm mt-1">{errores.titular}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar configuración"}
        </button>
      </form>
    </div>
  );
}

export default Configuracion;
