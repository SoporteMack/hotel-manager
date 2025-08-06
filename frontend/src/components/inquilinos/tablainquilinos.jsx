import { Itemtabla, ItemCardMobile } from './itemtabla';
import { useIsMobile } from '../../hooks/useIsMobile';

function Tablainquilinos({ items, onEditar}) {
  const isMobile = useIsMobile();

  return (
    <div className="w-full">
      {!isMobile ? (
        <div className="">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 w-[200px]">Nombre</th>
                <th className="px-4 py-3 w-[150px]">Teléfono</th>
                <th className="px-4 py-3 w-[200px]">Correo</th>
                <th className="px-4 py-3 w-[100px]">Estatus</th>
                <th className="px-4 py-3 w-[120px]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <Itemtabla
                  key={`web-${item.idPersona}`}
                  nombrePersona={item.nombrePersona}
                  apellidoPaterno={item.apellidoPaterno}
                  apellidoMaterno={item.apellidoMaterno}
                  telefono={item.telefono}
                  correo={item.correo}
                  estatus={item.estatus ? 'Activo' : 'Inactivo'}
                  idPersona={item.idPersona}
                  onEditar={() => onEditar(item)}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full px-4 py-6 bg-gray-50 space-y-4 min-h-screen">
          {items.map((item) => (
            <ItemCardMobile
              key={`web-${item.idPersona}`}
                  nombrePersona={item.nombrePersona}
                  apellidoPaterno={item.apellidoPaterno}
                  apellidoMaterno={item.apellidoMaterno}
                  telefono={item.telefono}
                  correo={item.correo}
                  estatus={item.estatus ? 'Activo' : 'Inactivo'}
                  idPersona={item.idPersona}
                  onEditar={() => onEditar(item)}
                  />
          ))}
        </div>
      )}
    </div>
  );
}

export default Tablainquilinos;
