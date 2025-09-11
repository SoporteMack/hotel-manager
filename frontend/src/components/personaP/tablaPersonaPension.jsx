function TablaPersonasPension({ items, onEditar }) {
    return (
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID Persona</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nombre</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Apellido</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((persona) => (
              <tr key={persona.idPersona}>
                <td className="px-4 py-2 text-sm text-gray-600">{persona.idPersona}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{persona.nombre}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{persona.apellido}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => onEditar(persona)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default TablaPersonasPension;
  