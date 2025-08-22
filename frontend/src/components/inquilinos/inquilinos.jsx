import { useEffect, useState, useMemo, useRef } from "react";
import Tablainquilinos from "./tablainquilinos";
import { listaInquilinos, agregarInquilinos, editarInquilinos } from "../../api/Inquilinos";
import Lista from "../items/lista";
import ModalInquilino from "./modalInquilino";
import { Notyf } from 'notyf';
import "notyf/notyf.min.css";

function Inquilinos() {
  const notyf = useRef(new Notyf({
    duration: 10000,
    dismissible:true,
    position: { x: 'center', y: 'top' },
  }));

  const [inquilinos, setInquilinos] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Activo');
  const [showModal, setShowModal] = useState(false);
  const [inquilinoEditar, setInquilinoEditar] = useState(null);

  const handleAgregar = () => {
    setInquilinoEditar(null);
    setShowModal(true);
  };

  const handleEditar = (inquilino) => {
    setInquilinoEditar(inquilino);
    setShowModal(true);
  };

  const handleGuardar = async (nuevoInquilino) => {
    try {
      if (inquilinoEditar) {
        await editarInquilinos(inquilinoEditar.idPersona,nuevoInquilino);
        notyf.current.success("Inquilino actualizado exitosamente");
      } else {
        await agregarInquilinos(nuevoInquilino);
        notyf.current.success("Inquilino guardado exitosamente");
      }

      setShowModal(false);
      obtenerInquilinos();
    } catch (e) {
      console.log(e)
      const error = e.response?.data?.errores?.[0]?.mensaje || "Error al guardar inquilino";
      notyf.current.error(error);
    }
  };

  const obtenerInquilinos = async () => {
    try {
      const res = await listaInquilinos();
      setInquilinos(res.data);
    } catch (error) {
      console.error("Error al obtener la lista de inquilinos:", error);
    }
  };

  useEffect(() => {
    obtenerInquilinos();
  }, []);

  const filteredItems = useMemo(() => {
    return inquilinos.filter(({ nombrePersona, apellidoPaterno, apellidoMaterno, telefono, correo, estatus }) => {
      const text = `${nombrePersona} ${apellidoPaterno} ${apellidoMaterno || ''} ${telefono} ${correo || ''}`.toLowerCase();
      const searchLower = search.toLowerCase();
      const matchesSearch = text.includes(searchLower);
      const matchesStatus =
        filterStatus === 'Todos' ||
        (filterStatus === 'Activo' && estatus) ||
        (filterStatus === 'Inactivo' && !estatus);
      return matchesSearch && matchesStatus;
    });
  }, [inquilinos, search, filterStatus]);

  return (
    <div className="">
    {/* Título de sección */}
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-title-section">Inquilinos</h1>
      <p className="text-sm text-description-section">Gestiona los inquilinos registrados en el sistema</p>
    </div>
  
    {/* Controles */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <input
        type="search"
        placeholder="Buscar inquilino..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full sm:max-w-xs border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
      />
  
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
        <Lista
          options={[
            { value: "Todos", label: "Todos" },
            { value: "Activo", label: "Activos" },
            { value: "Inactivo", label: "Inactivos" },
          ]}
          value={{ filterStatus }}
          onChange={setFilterStatus}
        />
  
        <div className="flex gap-2">
          <button
            onClick={obtenerInquilinos}
            className="border border-btn-border-edit text-btn-text-edit hover:border-btn-border-hover-edit hover:text-btn-text-hover-edit px-4 py-1.5 text-sm rounded-md transition"
          >
            Actualizar
          </button>
  
          <button
            onClick={handleAgregar}
            className="border bg-btn-add text-btn-text-add px-4 py-1.5 text-sm rounded-md hover:bg-btn-add-hover hover:text-btn-text-hover-add hover:border-btn-border-hover-add transition"
          >
            + Agregar
          </button>
        </div>
      </div>
    </div>
  
    {/* Modal de inquilino */}
    <ModalInquilino
      visible={showModal}
      onClose={() => setShowModal(false)}
      onGuardar={handleGuardar}
      item={inquilinoEditar}
    />
  
    {/* Tabla o mensaje */}
    {filteredItems.length === 0 ? (
      <p className="text-center text-gray-400 py-10 italic">No hay inquilinos que coincidan.</p>
    ) : (
      <Tablainquilinos items={filteredItems} onEditar={handleEditar} />
    )}
  </div>
  
  );
}

export default Inquilinos;
