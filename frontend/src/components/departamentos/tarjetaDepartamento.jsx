import { useEffect, useState } from "react"
import { nombredep } from "../../api/departamentos"
import { useAuth } from "../../context/authContext";

function TarjetaDepartamento({ numDepartamento, descripcion, costo, estatus, abrirModalEditar }) {
    const { user } = useAuth();
    const [nombre, setnombre] = useState();
    useEffect(() => {
        if (!estatus)
            getnombre();
    }, [])
    const getnombre = async () => {
        try {
            const res = await nombredep(numDepartamento).then(res => { return res.data });
            setnombre(res);
        } catch (error) {
            setnombre("desconocido")
        }
    }
    return (
        <div
            className={`border rounded-lg p-4 shadow-sm transition hover:shadow-md ${estatus ? "border-green-500" : "border-red-600"
                } flex flex-col justify-between`}
        >
            <div>
                <h2 className="text-lg font-medium text-gray-900">Departamento {descripcion}</h2>
                <p className="text-gray-600">Costo: ${Number(costo).toLocaleString()}</p>
                {!estatus && (<p className="text-gray-600">Nombre: {nombre}</p>)}
                <span
                    className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${estatus ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                        }`}
                >
                    {estatus ? "Libre" : "Ocupado"}
                </span>

            </div>
            {user?.rol === "admin" && (
                <button
                    onClick={() => abrirModalEditar({ numDepartamento, descripcion, costo, estatus })}
                    className="mt-4 self-start px-3 py-1 rounded-md border border-btn-border-edit to-btn-text-edit cursor-pointer select-none font-semibold
                    hover:text-btn-text-hover-edit hover:border-btn-text-hover-edit transition-colors duration-200 p-2">
                    Editar
                </button>)}
        </div>
    )
}

export default TarjetaDepartamento