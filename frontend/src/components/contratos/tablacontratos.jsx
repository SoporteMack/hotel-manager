import { useIsMobile } from '../../hooks/useIsMobile';
import { ItemTablaContrato, ItemCardContratoMobile } from './itemtablecontratos';

function TableContratos({ items, onEditar,setLoading,setIsOpen,setContrato,listar}) {
  const isMobile = useIsMobile();

  return (
    <div className="w-full">
      {!isMobile ? (
        <div className="overflow-auto rounded-lg shadow border border-gray-200">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Inquilino</th>
                <th className="px-4 py-3">#Dep</th>
                <th className="px-4 py-3">INE</th>
                <th className="px-4 py-3">Comprobante</th>
                <th className="px-4 py-3">Tarjeta</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <ItemTablaContrato key={item.idContrato} item={item} onEditar={onEditar}setLoading={setLoading}setIsOpen={setIsOpen}  setContrato={setContrato} listar={listar}/>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full px-4 py-6 bg-gray-50 space-y-4 min-h-screen">
          {items.map((item) => (
            <ItemCardContratoMobile key={item.idContrato} item={item} onEditar={onEditar}  setLoading={setLoading}setIsOpen={setIsOpen}  setContrato={setContrato}/>
          ))}
        </div>
      )}
    </div>
  );
}

export default TableContratos;
