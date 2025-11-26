import { useEffect, useState } from "react";
import { tarifas } from "../../api/tarifas";
import { useAuth } from "../../context/authContext";
import { nombre } from "../../api/pensiones";
import { getdif, getvig } from "../../api/pagosp";

export default function TarjetaPension({ pension, abrirModalEditar, setMPago, setItem, setNombre,setModalPagos,setPensionData}) {
  const [tarifasDisponibles, setTarifasDisponibles] = useState([]);
  const [nombreP, setNombreP] = useState("");
  const [diferencia, setDiferencia] = useState(0);
  const [VencimientoProximo, setVencimientoProximo] = useState(false);
  const [VencimientoPasado, setVencimientoPasado] = useState(false);
  const [vig, setVig] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    listartarifas();
    getDiferencia();
    if (pension) {
      getNombre(pension.idPersona);
    }
  }, [pension]);

  const getDiferencia = async () => {
    try {
      // Obtener diferencia
      const difResponse = await getdif({ idPension: pension.idPension });
      setDiferencia(difResponse.data);

      // Obtener fecha de vencimiento
      const vigResponse = await getvig({ idPension: pension.idPension });
      if (vigResponse.data && vigResponse.data.fechaVencimiento) {
        const vigDate = new Date(vigResponse.data.fechaVencimiento);
        const hoy = new Date();

        // Resetear horas para comparar solo fechas
        hoy.setHours(0, 0, 0, 0);
        vigDate.setHours(0, 0, 0, 0);
        vigDate.setDate(vigDate.getDate() + 1);

        // Calcular diferencia en días
        const diferenciaMs = vigDate.getTime() - hoy.getTime();
        const diferenciaDias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

        console.log(`Días de diferencia: ${diferenciaDias}`);

        // Verificar si está próximo a vencer (3 días o menos)
        if (diferenciaDias <= 3 && diferenciaDias >= 0) {
          setVencimientoProximo(true);
          console.log("Vencimiento próximo activado");
        } else {
          setVencimientoProximo(false);
        }

        // Verificar si el vencimiento ya pasó
        if (diferenciaDias < 0) {
          setVencimientoPasado(true);
          console.log("Vencimiento pasado activado");
        } else {
          setVencimientoPasado(false);
        }

        setVig(vigDate);
      } else {
        console.warn('No se encontró fecha de vencimiento');
        setVig(null);
        setVencimientoProximo(false);
        setVencimientoPasado(false);
      }
    } catch (error) {
      console.error('Error obteniendo datos:', error);
    }
  };

  const listartarifas = async () => {
    try {
      const res = await tarifas();
      setTarifasDisponibles(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getNombre = async (idPersona) => {
    try {
      const res = await nombre(idPersona);
      setNombreP(res.data.nombre);
    } catch (error) {
      console.error("Error obteniendo nombre:", error);
    }
  };

  const handleAbrirModal = (item, nombre) => {
    setNombre(nombre);
    setItem(item);
    setMPago(true);
  };

  const bordeColor = pension.estado ? "border-green-500" : "border-red-500";
  const botonColor = pension.estado
    ? "text-green-600 border-green-600 hover:bg-green-50"
    : "text-red-600 border-red-600 hover:bg-red-50";

  // Lógica para mostrar el botón de pago
  const mostrarBotonPago = pension.estado && (
    // Caso 1: Vencimiento ya pasó (APARECE SIEMPRE)
    VencimientoPasado ||
    // Caso 2: Vencimiento próximo y diferencia igual al precio acordado
    (VencimientoProximo && diferencia?.diferencia === pension.precioAcordado) ||
    // Caso 3: Vencimiento próximo y diferencia mayor al precio acordado
    (VencimientoProximo && diferencia?.diferencia > pension.precioAcordado)
  );
const abrirModalPagos = async ()=>{
  setModalPagos(true);
  setPensionData(pension);
}
  // Estilos para indicadores de vencimiento
  const getIndicadorVencimiento = () => {
    if (VencimientoPasado) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
          ⚠️ Vencido
        </span>
      );
    }
    if (VencimientoProximo) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
          ⏳ Próximo a vencer
        </span>
      );
    }
    return null;
  };

  return (
    <div
      className={`border ${bordeColor} rounded-2xl bg-white shadow-sm hover:shadow-md transition p-6`}
    >
      <div className="flex flex-wrap gap-6 justify-between">

        {/* Información principal */}
        <div className="flex-1 min-w-[260px] space-y-3">

          {/* Encabezado */}
          <div className="flex items-center flex-wrap gap-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              Pensión #{pension.idPension}
            </h2>

            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${pension.llave
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-200 text-gray-600"
                }`}
            >
              {pension.llave ? "🔒 Con llave" : "🔓 Sin llave"}
            </span>

            {getIndicadorVencimiento()}
          </div>

          {/* Nombre */}
          <div className="inline-block bg-yellow-100 text-gray-900 px-3 py-1 text-sm font-medium rounded-md shadow-sm">
            {nombreP || "Cargando..."}
          </div>

          {/* Datos */}
          <div className="space-y-1 text-sm text-gray-700">

            <p className="flex items-center gap-2">
              <i className="fa-regular fa-calendar"></i>
              Inicio: {pension.fechaInicio}
            </p>

            {vig && (
              <p className="flex items-center gap-2">
                <i className="fa-solid fa-hourglass-half"></i>
                Vencimiento: {vig.toLocaleDateString("es-MX")}
              </p>
            )}

            {user.rol === "admin" && (
              <p className="flex items-center gap-2">
                <i className="fa-solid fa-tag"></i>
                Precio acordado: ${pension.precioAcordado}
              </p>
            )}

            {diferencia?.diferencia !== undefined && (
              <p className="flex items-center gap-2 text-amber-700">
                <i className="fa-solid fa-circle-exclamation"></i>
                Diferencia pendiente: ${diferencia.diferencia}
              </p>
            )}

            <p className="flex items-center gap-2 font-semibold">
              Estado:
              <span
                className={pension.estado ? "text-green-600" : "text-red-600"}
              >
                {pension.estado ? "Activo" : "Inactivo"}
              </span>
            </p>
          </div>
        </div>

        {/* Botonera premium */}
        <div className="w-full flex flex-wrap items-center gap-3 bg-gray-50 p-4 rounded-xl shadow">

          {user.rol === "admin" && (
            <>
              {/* Editar */}
              <button
                onClick={() => abrirModalEditar(pension)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white hover:bg-gray-100 hover:shadow-sm transition"
              >
                <i className="fa-solid fa-pen-to-square text-gray-600"></i>
                Editar
              </button>

              {/* Ver Pagos */}
              <button
                onClick={() => abrirModalPagos(pension)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 hover:shadow-sm transition"
              >
                <i className="fa-solid fa-money-check-dollar"></i>
                Ver Pagos
              </button>
            </>
          )}

          {(mostrarBotonPago || user.rol === "admin") && (
            <button
              onClick={() => handleAbrirModal(pension, nombreP)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-green-600 text-green-600 bg-white hover:bg-green-50 hover:shadow-sm transition"
            >
              <i className="fa-solid fa-plus-circle"></i>
              Agregar Pago
            </button>
          )}
        </div>


      </div>

      {/* Tarifas */}
      {pension.tarifas?.length > 0 && (
        <div className="mt-5 border-t pt-4 border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Tarifas</h3>

          <div className="flex flex-wrap gap-2">
            {pension.tarifas.map((t) => {
              const info = tarifasDisponibles.find(
                (tar) => tar.idTarifa === t.idTarifa
              );

              return t.cantidad > 0 ? (
                <div
                  key={t.idTarifa}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm shadow-sm"
                >
                  <span>{info?.descripcion || "Tarifa"}</span>
                  <span className="bg-white border border-gray-300 px-2 py-0.5 rounded-full text-xs text-gray-700">
                    x{t.cantidad}
                  </span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );


}