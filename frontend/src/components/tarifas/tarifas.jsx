import { useEffect, useState, useRef, useMemo } from "react";
import { tarifas, crear, actualizar } from "../../api/tarifas";
import { Notyf } from "notyf";
import Lista from "../items/lista";
import { useAuth } from "../../context/authContext";
import TarjetaTarifa from "./tarjetaTarifa";
import ModalTarifas from "./modalTarifas";

function Tarifas() {
    const [listaTarifas, setListaTarifas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtro, setFiltro] = useState("Todos");
    const [buscar, setBuscar] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null); // null = crear, objeto = editar
    const { user } = useAuth();
    const notyf = useRef(
        new Notyf({
            duration: 3000,
            dismissible: true,
            position: { x: "right", y: "top" },
        })
    );

    const listar = async () => {
        setLoading(true);
        try {
            const res = await tarifas().then((res) => res.data);
            setListaTarifas(res);
        } catch (err) {
            notyf.current.error("Error al cargar tarifas");
            setError("No se pudieron cargar las tarifas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        listar();
    }, []);

    const itemFiltrado = useMemo(() => {
        return listaTarifas.filter(({ precio, descripcion, estado }) => {
            const texto = `${precio} ${descripcion} ${estado}`.toLowerCase();
            const busqueda = buscar.toLowerCase();
            const coincideBusqueda = texto.includes(busqueda);
            const coincideFiltro =
                filtro === "Todos" ||
                (filtro === "Activo" && estado) ||
                (filtro === "Inactivo" && !estado);
            return coincideBusqueda && coincideFiltro;
        });
    }, [listaTarifas, buscar, filtro]);

    const abrirModalNuevo = () => {
        setModalData(null);
        setModalOpen(true);
    };

    const abrirModalEditar = (tarifa) => {
        setModalData(tarifa);
        setModalOpen(true);
    };

    const guardarTarifa = async (data) => {
        try {
            if (modalData) {
                await actualizar(modalData.idTarifa, data);
                notyf.current.success("Tarifa actualizada");
            } else {
                await crear(data);
                notyf.current.success("Tarifa creada");
            }
            setModalOpen(false);
            listar();
        } catch (err) {
            console.error(err);
            notyf.current.error("Error al guardar la tarifa");
        }
    };

    if (loading) return <p className="text-center mt-6 text-gray-500">Cargando Tarifas...</p>;
    if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;

    return (
        <section className="max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Tarifas</h1>
                <p className="text-gray-500 mt-1">Gestiona las tarifas registradas en el sistema.</p>
            </div>

            {/* Filtros y búsqueda */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <label htmlFor="filtro" className="text-sm font-medium text-gray-700">Estado:</label>
                    <Lista
                        options={[
                            { value: "Todos", label: "Todos" },
                            { value: "Activo", label: "Activo" },
                            { value: "Inactivo", label: "Inactivo" },
                        ]}
                        value={filtro}
                        onChange={setFiltro}
                    />
                    {user?.rol === "admin" && (
                        <div className="flex gap-2">
                            {/* Botón Agregar */}
                            <button
                                onClick={abrirModalNuevo}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-800 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-200 hover:border-gray-400 transition-colors duration-200"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Agregar</span>
                            </button>

                            {/* Botón Actualizar */}
                        </div>
                    )}
                    <button
                        onClick={listar} // función que recarga la lista de tarifas
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-800 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-200 hover:border-gray-400 transition-colors duration-200"
                    >
                        <svg
                            className="w-4 h-4 rotate-0 animate-spin-slow"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6" />
                        </svg>
                        <span>Actualizar</span>
                    </button>
                </div>

                <div className="relative w-full sm:w-72">
                    <input
                        type="text"
                        placeholder="Buscar tarifa..."
                        value={buscar}
                        onChange={(e) => setBuscar(e.target.value)}
                        className="w-full border border-gray-200 rounded-md px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm transition"
                    />
                    <svg
                        className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Lista de tarifas */}
            <div>
                {itemFiltrado.length === 0 ? (
                    <p className="text-center text-gray-400">No hay tarifas disponibles.</p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {itemFiltrado.map((tarifa) => (
                            <TarjetaTarifa
                                key={tarifa.idTarifa}
                                {...tarifa}
                                onEditar={() => abrirModalEditar(tarifa)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <ModalTarifas
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={guardarTarifa}
                initialData={modalData}
                mode={modalData ? "edit" : "create"}
            />
        </section>
    );
}

export default Tarifas;
