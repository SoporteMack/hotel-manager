import { useState, useEffect, useMemo, useRef } from "react";
import { Notyf } from "notyf";
import ModalPension from "./modalPension";
import Lista from "../items/lista"; // Componente select
import { useAuth } from "../../context/authContext";
import { actualizarPension, crearPension, pensiones } from "../../api/pensiones"; // Tu API
import TarjetaPension from "./tarjetaPension";
import Loader from "../items/loader"

export default function Pensiones() {
  const [listaPensiones, setListaPensiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("Todos");
  const [buscar, setBuscar] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingG,setLoadingG] = useState(false);
  const [modalData, setModalData] = useState(null); // null = crear, objeto = editar
  
  const { user } = useAuth();
  const notyf = useRef(new Notyf({ duration: 3000, dismissible: true }));

  const listar = async () => {
    setLoading(true);
    setModalOpen(false)
    try {
      const res = await pensiones().then(r => r.data);
      setListaPensiones(res);
    } catch (err) {
      notyf.current.error("Error al cargar pensiones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listar();
  }, []);

  const abrirModalNuevo = () => {
    setModalData(null);
    setModalOpen(true);
  };

  const abrirModalEditar = (pension) => {
    setModalData(pension);
    setModalOpen(true);
  };

  const guardarPension = async (data) => {
    setLoadingG(true);
    try {
      if (modalData) {
        await actualizarPension(data);
        notyf.current.success("Pension Actulizada Correctamente")
      } else {
        // Crear nueva pensión
        await crearPension(data);
        notyf.current.success("Pension Creada Correctamente")
      }
      listar(); // refresca la lista
    } catch (err) {
      notyf.current.error("Error al guardar pensión");
    }finally{setLoadingG(false)}
  };
  

  // Filtrado simple
  const pensionesFiltradas = useMemo(() => {
    return listaPensiones.filter(p => {
      const texto = `${p.fechaInicio} ${p.precioAcordado} ${p.estado}`.toLowerCase();
      const busqueda = buscar.toLowerCase();
      const coincideFiltro =
        filtro === "Todos" ||
        (filtro === "Activo" && p.estado) ||
        (filtro === "Inactivo" && !p.estado);
      return texto.includes(busqueda) && coincideFiltro;
    });
  }, [listaPensiones, buscar, filtro]);

  if (loading) return <p className="text-center mt-6 text-gray-500">Cargando pensiones...</p>;

  return (
    <section className="max-w-5xl mx-auto p-6">
      {loadingG && (<Loader msg={"Guardando"}/>)}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pensiones</h1>

        
          <button
            onClick={abrirModalNuevo}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-800 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-200 hover:border-gray-400 transition-colors"
          >
            ➕ Agregar Pensión
          </button>
        
      </div>

      <div className="flex gap-2 mb-6">
        <Lista
          options={[
            { value: "Todos", label: "Todos" },
            { value: "Activo", label: "Activo" },
            { value: "Inactivo", label: "Inactivo" },
          ]}
          value={filtro}
          onChange={setFiltro}
        />
        <input
          type="text"
          placeholder="Buscar pensión..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent"
        />
      </div>

      {pensionesFiltradas.length === 0 ? (
        <p className="text-center text-gray-400">No hay pensiones disponibles.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pensionesFiltradas.map((p) => (
            <div key={p.idPension}>
              <TarjetaPension pension={p} abrirModalEditar={()=>abrirModalEditar(p)}/>
            </div>
          ))}
        </div>
      )}

      <ModalPension
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={guardarPension}
        initialData={modalData}
      />
    </section>
  );
}
