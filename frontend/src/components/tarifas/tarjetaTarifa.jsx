import { useEffect, useState } from "react"
import { useAuth } from "../../context/authContext";

function TarjetaTarifa({ idTarifa, descripcion, precio, estado,onEditar}) {
    const { user } = useAuth();

    
  
    return (
        <div
            className={`border rounded-lg p-4 shadow-sm transition hover:shadow-md ${estado ? "border-green-500" : "border-red-600"
                } flex flex-col justify-between`}
        >
            <div>
                <h2 className="text-lg font-medium text-gray-900">Tarifa {descripcion}</h2>
                {(user?.rol === "admin" || (user?.rol === "ayudante" && estado)) && (
                    <p className="text-gray-600">Costo: ${Number(precio).toLocaleString()}</p>
                )}
                <span
                    className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${estado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                        }`}
                >
                    {estado ? "Activo" : "Inactivo"}
                </span>

            </div>
            {user?.rol === "admin" && (
                <button
                    onClick={onEditar}
                    className="mt-4 self-start px-3 py-1 rounded-md border border-btn-border-edit to-btn-text-edit cursor-pointer select-none font-semibold
                    hover:text-btn-text-hover-edit hover:border-btn-text-hover-edit transition-colors duration-200 p-2">
                    Editar
                </button>)}
        </div>
    )
}

export default TarjetaTarifa