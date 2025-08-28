import { useEffect, useMemo, useState } from 'react';
import { listarContratos } from '../../api/contratos';
import TableContratos from './tablacontratos';
import Lista from '../items/lista';

import EditarContrato from "./editarContratos";

function Contratos() {
  const [filterStatus, setFilterStatus] = useState('Activo');
  const [contratos, setContratos] = useState(null); // null = aún no cargado
  const [search, setSearch] = useState(''); // siempre como string
  const [loading,setLoading] = useState(false);
  const [isOpen,setIsOpen] = useState(false);
  const onClose = ()=> setIsOpen(false)
  const [dataContrato,setDataContrato] = useState()

  useEffect(() => {
    listar();
  }, []);

  async function listar() {
    try {
      const lista = await listarContratos().then(res => res.data);
      setContratos(lista);
    } catch (error) {
      console.error("Error al listar contratos:", error);
      setContratos([]); // evita que se quede en null si falla
    }
  }

  const filtredItems = useMemo(() => {
    if (!contratos) return [];

    return contratos.filter(({ idContrato,descripcion, estatus, fechaInicio, fechaTermino ,persona,departamento}) => {

      const texto = `${descripcion}${idContrato || ''}${persona.nombrePersona}${persona.apellidoPaterno ||''}${persona.apellidoMaterno|| ''} ${departamento.descripcion}${fechaInicio}${fechaTermino}`.toLowerCase();
      const searchLower = search.toLowerCase();

      const matchesSearch = texto.includes(searchLower);
      const matchesStatus =
        filterStatus === 'Todos' ||
        (filterStatus === 'Activo' && estatus) ||
        (filterStatus === 'Inactivo' && !estatus);

      return matchesSearch && matchesStatus;
    });
  }, [contratos, search, filterStatus]);

  return (
    <section className="max-w-6xl mx-auto p-6">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md flex flex-col items-center gap-3">
            <div className="loader border-4 border-t-4 border-gray-200 border-t-green-500 rounded-full w-12 h-12 animate-spin"></div>
            <span className="text-gray-700 font-medium">Guardando contrato...</span>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label htmlFor="filtro" className="text-sm font-medium text-gray-700">Estado:</label>
          <Lista
            options={[
              { value: "Todos", label: "Todos" },
              { value: "Activo", label: "Activos" },
              { value: "Inactivo", label: "Inactivos" }
            ]}
            value={filterStatus}
            onChange={setFilterStatus}
          />
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="search"
            placeholder="Buscar por nombre, departamento, ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
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

      {contratos === null ? (
        <p className="text-gray-600 text-center mt-10">Cargando contratos...</p>
      ) : (
        <>
        <TableContratos items={filtredItems} setLoading={setLoading} setIsOpen={setIsOpen} setContrato={setDataContrato}/>
        
          {dataContrato && (<EditarContrato onClose={onClose} isOpen={isOpen} setIsOpen={setIsOpen} contrato={dataContrato} setData={setDataContrato} setIsOpenloader={setLoading}/>)}
        </>
      )}
    </section>
  );
}

export default Contratos;
