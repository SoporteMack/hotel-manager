import { useState, useEffect, useRef, useMemo } from "react";
import ModalDepartamento from "./modalDepartamento";
import { departamentos as listaDepartamentos, agregarDepartamento, actualizarDepartamento } from "../../api/departamentos";
import TarjetaDepartamento from "./tarjetaDepartamento";
import Lista from "../items/lista";
import { Notyf } from "notyf";
import { useAuth } from "../../context/authContext";

function Departamentos() {
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [departamentoEditar, setDepartamentoEditar] = useState(null);
  const [filtro, setFiltro] = useState('Todos');
  const [buscar, setBuscar] = useState('');
  const { user } = useAuth();

  const notyf = useRef(new Notyf({
    duration: 3000,
    dismissible: true,
    position: { x: 'right', y: 'top' },
  }));

  const cargarDepartamentos = async () => {
    try {
      setLoading(true);
      const res = await listaDepartamentos();
      setDepartamentos(res.data);
      setError(null);
    } catch {
      setError("Error al cargar departamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDepartamentos();
  }, []);

  const abrirModalNuevo = () => {
    setDepartamentoEditar(null);
    setModalVisible(true);
  };

  const abrirModalEditar = (departamento) => {
    setDepartamentoEditar(departamento);
    setModalVisible(true);
  };

  const guardarDepartamento = async (data) => {
    try {
      if (departamentoEditar) {
        await actualizarDepartamento(departamentoEditar.numDepartamento, data);
        notyf.current.success("Departamento actualizado correctamente");
      } else {
        await agregarDepartamento(data);
        notyf.current.success("Departamento creado correctamente");
      }
      setModalVisible(false);
      cargarDepartamentos();
    } catch {
      notyf.current.error("No se pudo completar la acción");
    }
  };

  const itemFiltrado = useMemo(() => {
    return departamentos.filter(({ numDepartamento, descripcion, costo, estatus }) => {
      const texto = `${numDepartamento} ${descripcion} ${costo} ${estatus}`.toLowerCase();
      const busqueda = buscar.toLowerCase();
      const coincideBusqueda = texto.includes(busqueda);
      const coincideFiltro =
        filtro === 'Todos' ||
        (filtro === 'Libre' && estatus) ||
        (filtro === 'Ocupado' && !estatus);
      return coincideBusqueda && coincideFiltro;
    });
  }, [departamentos, buscar, filtro]);

  if (loading) return <p className="text-center mt-6 text-gray-500">Cargando departamentos...</p>;
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;

  return (
    <section className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Departamentos</h1>
        <p className="text-gray-500 mt-1">Gestiona los departamentos registrados en el sistema.</p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="filtro" className="text-sm font-medium text-gray-700">Estado:</label>
          <Lista
            options={[
              { value: "Todos", label: "Todos" },
              { value: "Libre", label: "Libre" },
              { value: "Ocupado", label: "Ocupado" },
            ]}
            value={filtro}
            onChange={setFiltro}
          />
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Buscar departamento..."
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

      {/* Botón agregar */}
      {user?.rol === "admin" && (
        <div className="flex justify-end mb-6">
          <button
            onClick={abrirModalNuevo}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-100 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Agregar Departamento
          </button>
        </div>
      )}

      {/* Lista de departamentos */}
      <div>
        {itemFiltrado.length === 0 ? (
          <p className="text-center text-gray-400">No hay departamentos disponibles.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {itemFiltrado.map((dep) => (
              <TarjetaDepartamento
                key={dep.numDepartamento}
                {...dep}
                abrirModalEditar={()=>abrirModalEditar(dep)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <ModalDepartamento
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onGuardar={guardarDepartamento}
        departamento={departamentoEditar}
      />
    </section>
  );
}

export default Departamentos;
