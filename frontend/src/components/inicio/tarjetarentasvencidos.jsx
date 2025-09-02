function TarjetaRentaVencida({ renta }) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition border border-gray-100">
        {/* Encabezado con nombre */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-800">
            {renta["persona.nombrePersona"]} {renta["persona.apellidoPaterno"]} {renta["persona.apellidoMaterno"]}
          </h3>
          <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
            Vencida
          </span>
        </div>
  
        {/* Departamento */}
        <p className="text-gray-600 text-sm mb-2">
          <span className="font-medium">Departamento:</span> {renta["departamento.descripcion"]}
        </p>
  
        {/* Último pago */}
        <p className="text-gray-600 text-sm mb-2">
          <span className="font-medium">Último Pago:</span>{" "}
          {renta.ultimoPago ? renta.ultimoPago : "Sin registro"}
        </p>
  
        {/* Deuda */}
        <div className="mt-3">
          <p className="text-sm text-gray-500">Deuda acumulada</p>
          <p className="text-xl font-bold text-red-600">${parseFloat(renta.deuda).toLocaleString()}</p>
        </div>
      </div>
    );
  }
  
  export default TarjetaRentaVencida;
  