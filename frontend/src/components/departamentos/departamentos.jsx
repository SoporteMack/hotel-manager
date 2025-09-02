import { useState, useEffect, useRef, useMemo } from "react";
import ModalDepartamento from "./modalDepartamento";
import { departamentos as listaDepartamentos, agregarDepartamento, actualizarDepartamento } from "../../api/departamentos";
import TarjetaDepartamento from "./tarjetaDepartamento";
import Lista from "../items/lista";
import { Notyf } from "notyf";

function Departamentos() {
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [departamentoEditar, setDepartamentoEditar] = useState(null);
  const [filtro, setFiltro] = useState('Todos');
  const [buscar, setBuscar] = useState('');

  const notyf = useRef(new Notyf({
    duration: 3000,
    dismissible: true,
    position: { x: 'rigth', y: 'top' },
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
    } catch (error) {
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

  if (loading) return <p className="text-center mt-6">Cargando departamentos...</p>;
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;

  return (
    <section className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Departamentos</h1>
        <p className="text-sm text-gray-500">Gestiona los departamentos registrados en el sistema.</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 mb-4">
        {/* Filtro por estado */}
        <div className="flex items-center gap-2">
          <label htmlFor="filtro" className="text-sm font-medium text-gray-700">Estado:</label>
          <Lista
          options={[
            { value: "Todos", label: "Todos" },
            { value: "Libre", label: "Libre" },
            { value: "Ocupado", label: "Ocupado" },
          ]}
          value={{ filtro }}
          onChange={setFiltro}
        />
        </div>

        {/* Input búsqueda */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Buscar departamento..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 pl-10 text-sm focus:outline-none focus:ring focus:ring-blue-200"
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

      <button
        onClick={abrirModalNuevo}
        className="border bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition mb-6"
      >
        + Agregar Departamento
      </button>

      <div>
        {itemFiltrado.length === 0 ? (
          <p className="text-center text-gray-500">No hay departamentos disponibles.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {itemFiltrado.map(({ numDepartamento, descripcion, costo, estatus }) => (
              <TarjetaDepartamento
                key={numDepartamento}
                numDepartamento={numDepartamento}
                descripcion={descripcion}
                costo={costo}
                estatus={estatus}
                abrirModalEditar={abrirModalEditar}
              />
            ))}
          </div>
        )}
      </div>

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
