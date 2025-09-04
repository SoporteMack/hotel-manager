function Itemtabla({ nombrePersona, apellidoPaterno, apellidoMaterno, telefono, correo, estatus, idPersona, onEditar }) {
  return (
    <tr className="hidden lg:table-row border-b border-row-table-border-100 hover:bg-row-table-hover transition-colors duration-200">
      <td className="px-4 py-3 text-gray-900 font-medium truncate max-w-xs" title={nombrePersona}>
        {`${nombrePersona} ${apellidoPaterno} ${apellidoMaterno || ''}`}
      </td>
      <td className="px-4 py-3 text-gray-700 truncate max-w-xs" title={telefono}>
        {telefono}
      </td>
      <td className="px-4 py-3 text-gray-700 truncate max-w-sm" title={correo || "Sin correo"}>
        {correo || "Sin correo"}
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${estatus === "Activo"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
            }`}
        >
          {estatus}
        </span>
      </td>
      <td className="px-4 py-3 " >
        <button className="rounded-md border border-btn-border-edit to-btn-text-edit cursor-pointer select-none font-semibold
         hover:text-btn-text-hover-edit hover:border-btn-text-hover-edit transition-colors duration-200 p-2" onClick={onEditar}> 
          Editar
          </button>
      </td>
    </tr>
  );
}








function ItemCardMobile({ nombrePersona, apellidoPaterno, apellidoMaterno, telefono, correo, estatus, idPersona, onEditar, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-4 transition-transform transform hover:scale-[1.01]">
      <div className="flex flex-col gap-2 text-sm text-gray-800">
        <div className="flex justify-between">
          <h3 className="font-semibold text-base truncate">{`${nombrePersona} ${apellidoPaterno} ${apellidoMaterno || ''}`}</h3>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${estatus === "Activo"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
              }`}
          >
            {estatus}
          </span>
        </div>

        <div className="text-gray-600">
          <p><span className="font-medium">Teléfono:</span> {telefono}</p>
          <p><span className="font-medium">Correo:</span> {correo || "Sin correo"}</p>
        </div>

        <div className="flex justify-end gap-4 mt-3">
        <button
    onClick={onEditar}
    className="flex items-center gap-1 bg-btn-edit border border-btn-border-edit text-btn-text-edit hover:btn-border-hover-edit hover:to-btn-text-hover-edit px-3 py-1 rounded-md text-sm transition duration-200"
  >

            Editar
          </button>
        </div>
      </div>
    </div>
  );
}


export { Itemtabla, ItemCardMobile };
