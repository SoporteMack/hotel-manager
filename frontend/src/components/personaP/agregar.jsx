import { useEffect, useState, useMemo, useRef } from "react";
import ModalPersonaPension from "./modalPersonaPension";
import TablaPersonasPension from "./tablaPersonaPension";
import TarjetaPersonaPension from "./tarjetaPersonaPension"
import { Notyf } from 'notyf';
import "notyf/notyf.min.css";
import { listaPersonasPension, agregarPersonaPension, editarPersonaPension } from "../../api/personap";
import Loader from "../items/loader";
import { useIsMobile } from '../../hooks/useIsMobile';

function PersonasPension() {
  const notyf = useRef(new Notyf({
    duration: 10000,
    dismissible: true,
    position: { x: 'center', y: 'top' },
  }));
  const isMobile = useIsMobile();
  const [personas, setPersonas] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [personaEditar, setPersonaEditar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAgregar = () => {
    setPersonaEditar(null);
    setShowModal(true);
  };

  const handleEditar = (persona) => {
    setPersonaEditar(persona);
    setShowModal(true);
  };

  const handleGuardar = async (formData) => {
    setIsLoading(true);
    setShowModal(false);
    try {
      if (personaEditar) {
        const jsonObj = Object.fromEntries(formData.entries());
        console.log(jsonObj);
        await editarPersonaPension(jsonObj);
        notyf.current.success("Persona actualizada exitosamente");
      } else {
        await agregarPersonaPension(formData);
        notyf.current.success("Persona guardada exitosamente");
      }

      setShowModal(false);
      obtenerPersonas();
    } catch (e) {
      const error = e.response?.data?.message || "Error al guardar persona";
      notyf.current.error(error);
    } finally { setIsLoading(false); obtenerPersonas(); }
  };

  const obtenerPersonas = async () => {
    try {
      const res = await listaPersonasPension().then(res => { return res.data });
      setPersonas(res);
    } catch (error) {
      console.error("Error al obtener la lista de personas:", error);
    }
  };

  useEffect(() => {
    obtenerPersonas();
  }, []);

  const filteredItems = useMemo(() => {
    return personas.filter(({ nombre, apellido, idPersona }) => {
      const text = `${idPersona} ${nombre} ${apellido}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [personas, search]);

  return (
    <div className="p-4">
      {isLoading && (<Loader msg={"Agregando Persona ..."} />)}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-title-section">Registro de Personas para Pensión</h1>
        <p className="text-sm text-description-section">Gestiona las personas registradas y sus documentos</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <input
          type="search"
          placeholder="Buscar por nombre o ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:max-w-xs border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
        />

        <div className="flex gap-2">
          <button
            onClick={obtenerPersonas}
            className="border border-btn-border-edit text-btn-text-edit hover:border-btn-border-hover-edit hover:text-btn-text-hover-edit px-4 py-1.5 text-sm rounded-md transition"
          >
            Actualizar
          </button>

          <button
            onClick={handleAgregar}
            className="border bg-btn-add text-btn-text-add px-4 py-1.5 text-sm rounded-md hover:bg-btn-add-hover hover:text-btn-text-hover-add hover:border-btn-border-hover-add transition"
          >
            + Agregar Persona
          </button>
        </div>
      </div>

      {showModal && (<ModalPersonaPension
        onClose={() => setShowModal(false)}
        onGuardar={handleGuardar}
        item={personaEditar}
      />)}

      {filteredItems.length === 0 ? (
        <p className="text-center text-gray-400 py-10 italic">
          No hay personas registradas.
        </p>
      ) : (
        isMobile ? (
          <TarjetaPersonaPension
            items={filteredItems}
            onEditar={handleEditar}

          />
        ) : (
          <TablaPersonasPension
            items={filteredItems}
            onEditar={handleEditar}
            listar={obtenerPersonas}
          />
        )
      )}

    </div>
  );
}

export default PersonasPension;
