import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TarjetaInicio from "./inicio/tarjetainicio";
import { pagosdeldia as pagos, ocupacion as totalocupacion, ultimospagos as upagos } from "../api/inicio";

function Dashboard() {
  const [selectedPago, setSelectedPago] = useState(null);
  const [pagosDelDia, setPagosDelDia] = useState(0);
  const [ocupacion, setOcupacion] = useState({ libres: 0, porcentaje: 0 });
  const [ultimosPagos, setUltimosPagos] = useState([]);
  const [loadingPagos, setLoadingPagos] = useState(true);

  const getMontoColor = (monto) => {
    if (monto > 1000) return "text-green-600";
    if (monto > 500) return "text-yellow-600";
    return "text-red-600";
  };

  const obtenerPagosDelDia = async () => {
    try {
      const fecha = new Date();
      const anio = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const dia = String(fecha.getDate()).padStart(2, "0");
      const fechaFormateada = `${anio}-${mes}-${dia}`;
      const res = await pagos(fechaFormateada);
      setPagosDelDia(res.data.monto);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerOcupacion = async () => {
    try {
      const res = await totalocupacion();
      setOcupacion(res.data || { libres: 0, porcentaje: 0 });
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerUltimosPagos = async () => {
    try {
      const res = await upagos();
      setUltimosPagos(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPagos(false); // importante ponerlo en finally
    }
  };

  useEffect(() => {
    obtenerPagosDelDia();
    obtenerOcupacion();
    obtenerUltimosPagos();
  }, []);

  return (
    <div>
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-2xl sm:text-3xl font-bold min-w-72">Inicio</p>
      </div>

      <div className="flex flex-wrap gap-4 p-4">
        <TarjetaInicio titulo="Ingresos Recientes" valor={`$${pagosDelDia}`} />
        <TarjetaInicio titulo="Departamentos Libres" valor={`${ocupacion.libres}`} />
        <TarjetaInicio titulo="Porcentaje Ocupados" valor={`${ocupacion.porcentaje}`} />
      </div>

      <h2 className="text-[22px] font-bold px-4 pb-3 pt-5">Últimos 5 Ingresos del día</h2>

      <div className="grid gap-4 px-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Loader skeleton */}
        {loadingPagos &&
          Array.from({ length: 3 }).map((_, idx) => (
            <motion.div
              key={idx}
              className="bg-gray-200 rounded-lg p-4 flex flex-col gap-2 animate-pulse h-28"
            />
          ))}

        {/* Pagos reales */}
        {!loadingPagos &&
          ultimosPagos.length > 0 &&
          ultimosPagos.map((ingreso, idx) => (
            <motion.div
              key={idx}
              className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center
                 hover:shadow-xl cursor-pointer relative group"
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedPago(ingreso)}
            >
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm sm:text-base">
                  {ingreso.contrato.departamento.descripcion}
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">{ingreso.fechaPago}</p>
              </div>

              <div
                className={`mt-2 sm:mt-0 sm:ml-4 font-semibold text-lg sm:text-xl ${getMontoColor(
                  ingreso.monto
                )}`}
              >
                ${ingreso.monto}
              </div>

              <span className="absolute top-2 right-2 bg-gray-700 text-white text-xs font-semibold px-2 py-1 rounded opacity-0 group-hover:opacity-80 transition-opacity duration-200">
                Ver más
              </span>
            </motion.div>
          ))}

        {/* No hay pagos */}
        {!loadingPagos && ultimosPagos.length === 0 && (
          <p className="text-gray-500 col-span-full">No hay ingresos registrados hoy</p>
        )}
      </div>

      {/* Modal animado */}
      <AnimatePresence>
        {selectedPago && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-11/12 max-w-md shadow-2xl relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <h3 className="text-xl font-semibold mb-4">Detalle del Pago</h3>
              <p>
                <strong>Folio:</strong> {selectedPago.folio}
              </p>
              <p>
                <strong>Departamento:</strong> {selectedPago.contrato.departamento.descripcion}
              </p>
              <p>
                <strong>Fecha:</strong> {selectedPago.fechaPago}
              </p>
              <p>
                <strong>Cliente:</strong>{" "}
                {selectedPago.contrato?.persona?.nombrePersona || ""}{" "}
                {selectedPago.contrato?.persona?.apellidoPaterno || ""}{" "}
                {selectedPago.contrato?.persona?.apellidoMaterno || ""}
              </p>

              <button
                className="mt-6 w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                onClick={() => setSelectedPago(null)}
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dashboard;
