import { useAuth } from "../../context/authContext";
function TarjetaPersonaPension ({items,onEditar})
{
  const {user} = useAuth();
    return (<div className="grid gap-3">
  {items.map((persona) => (
    <div
      key={persona.idPersona}
      className="border rounded-xl p-4 shadow-sm bg-white flex flex-col"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold text-gray-800">
          {persona.nombre} {persona.apellido}
        </h3>
        <span className="text-xs text-gray-500">ID: {persona.idPersona}</span>
      </div>

      {user.rol ==="admin" &&(<div className="mt-3 flex justify-end">
        <button
          onClick={() => onEditar(persona)}
          className="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          Editar
        </button>
      </div>)}
    </div>
  ))}
</div>)

}
export default TarjetaPersonaPension;