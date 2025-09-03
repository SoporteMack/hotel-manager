function TarjetaRentaProximoVencimiento({ renta }) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition duration-200">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-md font-semibold text-gray-800">
            {renta["persona.nombrePersona"]} {renta["persona.apellidoPaterno"]} {renta["persona.apellidoMaterno"]}
          </h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
            Vence mañana
          </span>
        </div>
  
        {/* Detalles */}
        <div className="text-gray-700 text-sm space-y-1">
          <p>
            <span className="font-medium">Departamento:</span> {renta["departamento.descripcion"]}
          </p>
          <p>
            <span className="font-medium">Teléfono:</span> {renta["persona.telefono"]}
          </p>
        </div>
      </div>
    );
  }
  
  export default TarjetaRentaProximoVencimiento;
  