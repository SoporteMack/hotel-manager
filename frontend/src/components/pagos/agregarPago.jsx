import { useState, useRef,useEffect } from "react";
import ModalPago from "./modalPagos";
import { listacontratosxpersona } from "../../api/contratos";
import { Notyf } from "notyf"; Notyf
import { pago as realizarPago } from "../../api/pagos";
import { useAuth } from "../../context/authContext";

function AgregarPagos() {
    const notyf = useRef(new Notyf({
        duration: 10000,
        dismissible: true,
        position: { x: 'center', y: 'top' },
    }));
    const [nombre, setNombre] = useState("");
    const [paterno, setPaterno] = useState("");
    const [materno, setMaterno] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [inquilinos, setInquilinos] = useState([]);
    const [data, setData] = useState(null);
    const [pago, setPago] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);
    const {user} = useAuth();
    const handlebuscar = async (e) => {
        e.preventDefault();
        setData(null);
        // Validación básica de campos
        if (!nombre.trim() && !paterno.trim() && !materno.trim()) {
            setData(null)
            setError("Debe ingresar al menos un campo de búsqueda");
            return;
        }

        try {
            setIsLoading(true);
            setError(null);


            const inquilinosdb = await listacontratosxpersona(nombre, paterno, materno).then(response => { return response.data });
            setInquilinos(inquilinosdb);

            setIsOpen(true);
        } catch (err) {
            setError("Error al buscar inquilinos. Intente nuevamente.");
            console.error("Error en la búsqueda:", err);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        console.log(user?.rol === "admin")
        if (user?.rol === "admin")
            setIsAdmin(true)
    }, [])
    const onClose = () => {
        setIsOpen(false);
    }
    const handlePagar = async () => {
        if (data && pago > 0) {
            const fecha = new Date();
            const fechaFormateada = formatFechaHoraLocal(fecha);
            const datapago = {
                monto: pago,
                fechaPago: fechaFormateada,
                idContrato: data.idContrato,
                deuda: data.deuda
            }
            setLoading(true);
            try {
                await realizarPago(datapago);
                notyf.current.success("Pago realizado correctamente");
                setData(null);
            } catch (e) {
                notyf.current.success("error al relizar al pago volver a intertarlo mas tarde");
                setData(null);
            }
            finally {
                setLoading(false);
            }
        }
        else {
            if (pago <= 0)
                notyf.current.error("El Pago debe de ser mayor a 0 Pesos")
            else
                notyf.current.error("Debe de Selecionar un Inquilino")
        }
    }
    const formatFechaHoraLocal = (fecha) => {
        const f = new Date(fecha);
        const pad = n => n.toString().padStart(2, '0');
        return `${f.getFullYear()}-${pad(f.getMonth())}-${pad(f.getDate())} ${pad(f.getHours())}:${pad(f.getMinutes())}:${pad(f.getSeconds())}`;
    };

    return (
        <section className="flex-1 flex flex-col h-full p-4 md:p-6">
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-md flex flex-col items-center gap-3">
                        <div className="loader border-4 border-t-4 border-gray-200 border-t-green-500 rounded-full w-12 h-12 animate-spin"></div>
                        <span className="text-gray-700 font-medium">Guardando Pago...</span>
                    </div>
                </div>
            )}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Agregar Pagos</h1>
                <p className="text-sm text-gray-500">Sección para agregar pagos a los contratos correspondientes</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                <h2 className="text-lg font-medium text-gray-700 mb-4">Buscar inquilino</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handlebuscar} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Campo Nombre */}
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre(s):
                            </label>
                            <input
                                id="nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                type="text"
                                placeholder="Ej. Juan Carlos"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-[42px]"
                            />
                        </div>

                        {/* Campo Apellido Paterno */}
                        <div>
                            <label htmlFor="paterno" className="block text-sm font-medium text-gray-700 mb-1">
                                Apellido Paterno:
                            </label>
                            <input
                                id="paterno"
                                value={paterno}
                                onChange={(e) => setPaterno(e.target.value)}
                                type="text"
                                placeholder="Ej. Pérez"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-[42px]"
                            />
                        </div>

                        {/* Campo Apellido Materno */}
                        <div>
                            <label htmlFor="materno" className="block text-sm font-medium text-gray-700 mb-1">
                                Apellido Materno:
                            </label>
                            <input
                                id="materno"
                                value={materno}
                                onChange={(e) => setMaterno(e.target.value)}
                                type="text"
                                placeholder="Ej. López"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-[42px]"
                            />
                        </div>
                    </div>

                    <div className="flex justify-start gap-3">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium rounded-md transition h-[42px] whitespace-nowrap ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            {isLoading ? "Buscando..." : "Buscar Inquilino"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Loading overlay */}
            {isLoading && (
                <div className="z-50 fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
            )}

            {/* Modal de resultados */}
            <ModalPago onClose={onClose} isOpen={isOpen} setIsOpen={setIsOpen} inquilinos={inquilinos} setData={setData} setPago={setPago} />
            <section className='flex-1 flex flex-col  bg-gray-200 w-full mt-3 rounded-xl'>
                {
                    data ? (
                        <>
                            <div className="w-full p-2 flex flex-col md:flex-row md:items-center">
                                <label
                                    htmlFor="nombrecompleto"
                                    className="text-sm font-medium text-gray-700 mb-1 md:mb-0 md:w-40"
                                >
                                    Nombre(s):
                                </label>
                                <input
                                    id="nombrecompleto"
                                    type="text"
                                    className="w-full md:flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    disabled
                                    value={`${data.persona.nombrePersona} ${data.persona.apellidoMaterno} ${data.persona.apellidoPaterno}`}
                                />
                            </div>

                            <div className="w-full p-2 flex flex-col md:flex-row md:items-center">
                                <label
                                    htmlFor="deuda"
                                    className="text-sm font-medium text-gray-700 mb-1 md:mb-0 md:w-40"
                                >
                                    Deuda:
                                </label>
                                <input
                                    id="deuda"
                                    type="text"
                                    className="w-full md:flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm"
                                    disabled
                                    value={data.deuda}
                                />
                            </div>

                            <div className="w-full p-2 flex flex-col md:flex-row md:items-center">
                                <label
                                    htmlFor="departamento"
                                    className="text-sm font-medium text-gray-700 mb-1 md:mb-0 md:w-40"
                                >
                                    Departamento:
                                </label>
                                <input
                                    id="departamento"
                                    type="text"
                                    className="w-full md:flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm"
                                    disabled
                                    value={data.departamento.descripcion}
                                />
                            </div>

                            <div className="w-full p-2 flex flex-col md:flex-row md:items-center">
                                <label
                                    htmlFor="pago"
                                    className="text-sm font-medium text-gray-700 mb-1 md:mb-0 md:w-40"
                                >
                                    Pago:
                                </label>
                                {console.log(isAdmin)}
                                <input
                                    id="pago"
                                    type="number"
                                    className="w-full md:flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm"
                                    value={pago}
                                    onChange={(e) => { setPago(e.target.value) }}
                                    disabled={!isAdmin}
                                />
                            </div>
                            <div className="w-full p-2 flex justify-end">
                                <button
                                    type="button"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition"
                                    onClick={handlePagar} // asegúrate de definir esta función en tu componente
                                >
                                    Pagar
                                </button>
                            </div>

                        </>
                    ) : null
                }

            </section>
        </section>
    )
}

export default AgregarPagos;