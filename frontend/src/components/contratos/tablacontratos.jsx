import { useState } from "react";
import { useIsMobile } from '../../hooks/useIsMobile';
import { ItemTablaContrato } from './itemtablecontratos';

function TableContratos({ items, onEditar, setLoading, setIsOpen, setContrato, listar }) {
  const isMobile = useIsMobile();
  const [expandedIds, setExpandedIds] = useState([]);

  const toggleItem = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full space-y-2">
      {items.map((item) => (
        <div key={item.idContrato} className="border rounded-lg overflow-hidden shadow-sm">
          {/* Header toggle */}
          <div
            className="flex justify-between items-center cursor-pointer px-4 py-3 bg-gray-100 hover:bg-gray-200"
            onClick={() => toggleItem(item.idContrato)}
          >
            <div>
              <span className="font-medium">{item.persona.nombrePersona} {item.persona.apellidoPaterno}</span>
              <span className="ml-2 text-gray-600">{item.departamento?.descripcion}</span>
            </div>
            <div className="text-gray-500">{expandedIds.includes(item.idContrato) ? "▲" : "▼"}</div>
          </div>

          {/* Detalles */}
          {expandedIds.includes(item.idContrato) && (
            <div className="p-4 bg-white">
              
                <ItemTablaContrato
                  item={item}
                  onEditar={onEditar}
                  setLoading={setLoading}
                  setIsOpen={setIsOpen}
                  setContrato={setContrato}
                  listar={listar}
                />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default TableContratos;
