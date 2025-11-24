import { useEffect, useState } from "react";
import { tarifas } from "../../api/tarifas";
import { useAuth } from "../../context/authContext";
import { nombre } from "../../api/pensiones";
import { getdif, getvig } from "../../api/pagosp";

export default function TarjetaPension({ pension, abrirModalEditar, setMPago, setItem, setNombre}) {
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
        vigDate.setDate(vigDate.getDate()+1);
        
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
      className={`border-2 ${bordeColor} rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-semibold text-gray-800">
              Pensión #{pension.idPension}
            </h2>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                pension.llave ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-500"
              } flex items-center gap-1`}
            >
              {pension.llave ? "🔒 Con llave" : "🔓 Sin llave"}
            </span>
            {getIndicadorVencimiento()}
          </div>

          <span className="inline-block px-3 py-1 rounded-md text-sm font-semibold bg-yellow-100 text-gray-900 shadow-md mb-2">
            {nombreP || "Cargando..."}
          </span>

          <div className="space-y-1">
            <p className="text-sm text-gray-500">Fecha inicio: {pension.fechaInicio}</p>
            {vig && (
              <p className="text-sm text-gray-500">
                Vencimiento: {vig.toLocaleDateString('es-MX')}
              </p>
            )}
            {user.rol === "admin" && (
              <p className="text-sm text-gray-500">Precio acordado: ${pension.precioAcordado}</p>
            )}
            {diferencia?.diferencia !== undefined && (
              <p className="text-sm text-gray-500">Diferencia pendiente: ${diferencia.diferencia}</p>
            )}
            <p className="text-sm font-medium">
              Estado:{" "}
              <span className={pension.estado ? "text-green-600" : "text-red-500"}>
                {pension.estado ? "Activo" : "Inactivo"}
              </span>
            </p>
          </div>

        
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col gap-2 ml-4">
          {user.rol === "admin" && (
            <button
              onClick={() => abrirModalEditar(pension)}
              className={`px-4 py-2 text-sm font-medium rounded-md border ${botonColor} transition hover:scale-105`}
            >
              Editar
            </button>
          )}
          
          {(mostrarBotonPago || user.rol ==="admin") && (
            <button
              onClick={() => handleAbrirModal(pension, nombreP)}
              className="px-4 py-2 text-sm font-medium rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition hover:scale-105"
            >
              Agregar Pago
            </button>
          )}
        </div>
      </div>

      {/* Tarifas como chips */}
      {pension.tarifas && pension.tarifas.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Tarifas:</h3>
          <div className="flex flex-wrap gap-2">
            {pension.tarifas.map((t) => {
              const tarifaInfo = tarifasDisponibles.find((tar) => tar.idTarifa === t.idTarifa);
              if (t.cantidad > 0) {
                return (
                  <div
                    key={t.idTarifa}
                    className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium flex items-center gap-1 shadow-sm"
                  >
                    <span>{tarifaInfo?.descripcion || "Tarifa"}</span>
                    <span className="bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                      x{t.cantidad || 0}
                    </span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}