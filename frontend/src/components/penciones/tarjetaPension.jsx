import { useEffect, useState } from "react";
import { tarifas } from "../../api/tarifas";
import { useAuth } from "../../context/authContext";
import { nombre } from "../../api/pensiones"; // Tu API

export default function TarjetaPension({ pension, abrirModalEditar, setMPago, setItem,setNombre}) {
  const [tarifasDisponibles, setTarifasDisponibles] = useState([]);
  const [nombreP, setNombreP] = useState("")
  const { user } = useAuth();

  useEffect(() => {
    listartarifas();
    if (pension)
      getNombre(pension.idPersona)
  }, []);

  const listartarifas = async () => {
    try {
      const res = await tarifas().then((res) => res.data);
      setTarifasDisponibles(res);
    } catch (error) {
      console.error(error);
    }
  };
  const getNombre = async (idPersona) => {
    const res = await nombre(idPersona).then(res => { return res.data.nombre });
    setNombreP(res)
  }
  const handleAbrirModal = (item,nombre)=>
  {
    setNombre(nombre);
    setItem(item)
    setMPago(true)
  }

  const bordeColor = pension.estado ? "border-green-500" : "border-red-500";
  const botonColor = pension.estado
    ? "text-green-600 border-green-600 hover:bg-green-50"
    : "text-red-600 border-red-600 hover:bg-red-50";

  return (
    <div
      className={`border-2 ${bordeColor} rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
            Pensión #{pension.idPension}
            {/* Indicador de llave */}
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${pension.llave ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-500"
                } flex items-center gap-1`}
            >
              {pension.llave ? "🔒 Con llave" : "🔓 Sin llave"}
            </span>
          </h2>
          <span className="px-3 py-1 rounded-md text-sm font-semibold bg-yellow-100 text-gray-900 shadow-md">
            {nombreP || "Cargando..."}
          </span>

          <p className="text-sm text-gray-500">Fecha inicio: {pension.fechaInicio}</p>
          {user.rol === "admin" && (
            <p className="text-sm text-gray-500">Precio acordado: ${pension.precioAcordado}</p>
          )}
          <p className="text-sm font-medium mt-1">
            Estado:{" "}
            <span className={pension.estado ? "text-green-600" : "text-red-500"}>
              {pension.estado ? "Activo" : "Inactivo"}
            </span>
          </p>
        </div>

        {/* Botón solo contorno según estado */}
        <div className="flex flex-col gap-2">
          {user.rol === "admin" && (
            <button
              onClick={() => abrirModalEditar(pension)}
              className={`px-4 py-2 text-sm font-medium rounded-md border ${botonColor} transition`}
            >
              Editar
            </button>
          )}

          {pension.estado && (
            <button
              onClick={()=>handleAbrirModal(pension,nombreP)}
              className={`px-4 py-2 text-sm font-medium rounded-md border ${botonColor} transition`}
            >
              Agregar Pago
            </button>)

          }
        </div>

      </div>

      {/* Tarifas como chips */}
      {pension.tarifas && pension.tarifas.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Tarifas:</h3>
          <div className="flex flex-wrap gap-2">
            {pension.tarifas.map((t) => {
              const tarifaInfo = tarifasDisponibles.find((tar) => tar.idTarifa === t.idTarifa);
              if(t.cantidad > 0){
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
              );}
            })}
          </div>
        </div>
      )}
    </div>
  );
}
