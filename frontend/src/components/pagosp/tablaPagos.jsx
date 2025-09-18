import React, { useState, useMemo, useEffect } from "react";
import Loader from "../items/loader";
import { listarxfecha } from "../../api/pagosp";
import { useIsMobile } from '../../hooks/useIsMobile';

export default function TablaPagos() {
  const isMobile = useIsMobile();
  const [busqueda, setBusqueda] = useState("");
  const [pagos, setPagos] = useState([])
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [loading,setLoading] =useState(false);
  // Filtrado con useMemo para optimizar
  const pagosFiltrados = useMemo(() => {
    return pagos
      .map(pago => ({
        idPago: pago.idPago,
        idCobro: pago.idCobro,
        montoPagado: pago.montoPagado,
        fechaPago: pago.fechaPago,
        fechaVencimiento: pago.cobro?.fechaVencimiento || "",
        nombre: pago.cobro?.pensione?.PersonaP?.nombre || "",
        apellido: pago.cobro?.pensione?.PersonaP?.apellido || ""
      }))
      .filter(pago => {
        const termino = busqueda.toLowerCase();
        return (
          pago.nombre.toLowerCase().includes(termino) ||
          pago.apellido.toLowerCase().includes(termino) ||
          pago.idPago.toString().includes(termino) ||
          pago.idCobro.toString().includes(termino)
        );
      });
  }, [busqueda, pagos]);
  
  useEffect(() => {
      inicio();
    }, [])
  const handleEnviar = async () => {
    const fechas = validarFecha();
    if (!fechas) return;

    setLoading(true)
    try {
      const res = await listarxfecha(fechas.inicio,fechas.fin)
      console.log(res.data)
      setPagos(res.data || []);
    } catch (error) {
      notyf.current.error("Error al consultar pagos.");
    }
    finally { setLoading(false) }
  };
  const validarFecha = () => {
    if (!fechaInicio && !fechaFinal) {
      notyf.current.error("Debes seleccionar al menos una fecha.");
      return null;
    }

    const parseLocalDate = (str) => {
      const [y, m, d] = str.split("-");
      return new Date(y, m - 1, d);
    };

    let inicio = fechaInicio ? parseLocalDate(fechaInicio) : null;
    let fin = fechaFinal ? parseLocalDate(fechaFinal) : null;

    if (inicio && !fin) fin = new Date(inicio);
    else if (!inicio && fin) inicio = new Date(fin);

    if (inicio > fin) {
      notyf.current.error("La fecha de inicio no puede ser mayor que la fecha final.");
      return null;
    }

    inicio.setHours(0, 0, 0, 0);
    fin.setHours(23, 59, 59, 999);

    return {
      inicio: formatLocalFecha(inicio),
      fin: formatLocalFecha(fin),
    };
  };
  const formatLocalFecha = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };
  const inicio = async () => {
      const hoy = new Date();
  
      // Primer día a las 00:00:00
      // Primer día del mes
      const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      primerDia.setHours(0, 0, 0, 0);
  
      setFechaInicio(
        primerDia.getFullYear() + '-' +
        String(primerDia.getMonth() + 1).padStart(2, '0') + '-' +
        String(primerDia.getDate()).padStart(2, '0')
      );
  
  
  
      // Último día a las 23:59:59
      const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
      ultimoDia.setHours(23, 59, 59, 999);
      setFechaFinal(
        ultimoDia.getFullYear() + '-' +
        String(ultimoDia.getMonth() + 1).padStart(2, '0') + '-' +
        String(ultimoDia.getDate()).padStart(2, '0')
      );
  
      const pdiaf = formatFechaHoraLocal(primerDia);
      const udiaf = formatFechaHoraLocal(ultimoDia);
      setLoading(true)
      try {
        const res = await listarxfecha(pdiaf, udiaf).then(res => { return res.data });
        setPagos(res|| []);
      } catch (error) {
        console.log(error)
        notyf.current.error("error al cargar pagos")
      } finally { setLoading(false) }
    };
    const formatFechaHoraLocal = (fecha) => {
      const f = new Date(fecha);
      const pad = n => n.toString().padStart(2, '0');
      return `${f.getFullYear()}-${pad(f.getMonth() + 1)}-${pad(f.getDate())} ${pad(f.getHours())}:${pad(f.getMinutes())}:${pad(f.getSeconds())}`;
    };
  
  return (
    <div className="p-4">
      {/* Barra de búsqueda */}
      {loading && (<Loader msg={"Cargando"}/>)}
      <div className="flex flex-col md:flex-row md:items-center gap-3 ">
        <input
          type="date"
          defaultValue={fechaInicio}
          onChange={e => setFechaInicio(e.target.value)}
          className="w-full md:w-48 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
        <input
          type="date"
          defaultValue={fechaFinal}
          onChange={e => setFechaFinal(e.target.value)}
          className="w-full md:w-48 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button
          type="button"
          className="md:w-48 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
          onClick={handleEnviar}
        >
          Consultar
        </button>
      </div>
      <div className="mb-3">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, apellido o ID..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabla responsiva */}
     {!isMobile?( 
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Folio</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Monto</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Fecha Pago</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Vencimiento</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Nombre</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Apellido</th>
            </tr>
          </thead>
          <tbody>
            {pagosFiltrados.map((pago) => (
              <tr key={pago.idPago} className="border-t hover:bg-gray-50">
                {console.log(pago)}
                <td className="px-3 py-2">#{pago.idPago}</td>
                <td className="px-3 py-2">${parseFloat(pago.montoPagado).toFixed(2)}</td>
                <td className="px-3 py-2">
                  {new Date(pago.fechaPago).toLocaleDateString("es-MX")}
                </td>
                <td className="px-3 py-2">{new Date(pago.fechaVencimiento).toLocaleDateString("es-MX")}</td>
                <td className="px-3 py-2">{pago.nombre}</td>
                <td className="px-3 py-2">{pago.apellido}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>):( 
      <div className="grid gap-3 mt-4">
        {pagosFiltrados.map((pago) => (
          <div key={pago.idPago} className="border rounded-lg p-3 shadow-sm bg-white">
            <p className="text-sm"><span className="font-semibold">ID Pago:</span> {pago.idPago}</p>
            <p className="text-sm"><span className="font-semibold">Monto:</span> ${parseFloat(pago.montoPagado).toFixed(2)}</p>
            <p className="text-sm"><span className="font-semibold">Fecha Pago:</span> {new Date(pago.fechaPago).toLocaleDateString("es-MX")}</p>
            <p className="text-sm"><span className="font-semibold">Vencimiento:</span> {new Date(pago.fechaVencimiento).toLocaleDateString("es-MX")}</p>
            <p className="text-sm"><span className="font-semibold">Alumno:</span> {pago.nombre} {pago.apellido}</p>
          </div>
        ))}
      </div>)}
    </div>
  );
}
