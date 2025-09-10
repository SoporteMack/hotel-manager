// TablaContratos.jsx
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import ModalAgregarDocs from "./modalAgregarDocs";
import ModalObservaciones from "./modalObservaciones";
import { ItemTablaContrato } from "./itemtablecontratos";

function TablaContratos({ items, setLoading, setIsOpen, setContrato, listar }) {
  const { user } = useAuth();
  const [modalAddDoc, setModalAddDoc] = useState(false);
  const [openObservaciones, setOpenObservaciones] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleEditar = (item) => {
    setContrato(item);
    setIsOpen(true);
  };

  const handleAgregarDoc = (item) => {
    setSelectedItem(item);
    setModalAddDoc(true);
  };

  const handleVerObservaciones = (item) => {
    setSelectedItem(item);
    setOpenObservaciones(true);
  };

  const handleCloseModalAddDoc = () => {
    setModalAddDoc(false);
    setSelectedItem(null);
  };

  const handleCloseModalObservaciones = () => {
    setOpenObservaciones(false);
    setSelectedItem(null);
  };

  return (
    <div className="w-full">
      {/* Vista Desktop - Tabla tradicional */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full table-auto border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
        <thead className="border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-left font-medium text-gray-900 text-sm">
                Inquilino
              </th>
              <th className="px-8 py-5 text-left font-medium text-gray-900 text-sm">
                Departamento
              </th>
              <th className="px-8 py-5 text-center font-medium text-gray-900 text-sm">
                Estado
              </th>
              <th className="px-8 py-5 text-center font-medium text-gray-900 text-sm">
                Documentos
              </th>
              <th className="px-8 py-5 text-center font-medium text-gray-900 text-sm">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <ItemTablaContrato
                key={item.idContrato}
                item={item}
                setLoading={setLoading}
                user={user}
                onEditar={() => handleEditar(item)}
                onAgregarDoc={() => handleAgregarDoc(item)}
                onVerObservaciones={() => handleVerObservaciones(item)}
                viewMode="desktop"
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista Mobile/Tablet - Cards */}
      <div className="lg:hidden space-y-4">
        {items.map((item) => (
          <ItemTablaContrato
            key={item.idContrato}
            item={item}
            setLoading={setLoading}
            user={user}
            onEditar={() => handleEditar(item)}
            onAgregarDoc={() => handleAgregarDoc(item)}
            onVerObservaciones={() => handleVerObservaciones(item)}
            viewMode="mobile"
          />
        ))}
      </div>

      {/* Modales */}
      {selectedItem && (
        <ModalAgregarDocs
          isOpen={modalAddDoc}
          setIsOpen={handleCloseModalAddDoc}
          item={selectedItem}
          listar={listar}
        />
      )}
      {selectedItem && (
        <ModalObservaciones
          isOpen={openObservaciones}
          setIsOpen={handleCloseModalObservaciones}
          observaciones={selectedItem.observaciones}
          idContrato={selectedItem.idContrato}
          setLoading={setLoading}
          listar={listar}
        />
      )}
    </div>
  );
}

export default TablaContratos;