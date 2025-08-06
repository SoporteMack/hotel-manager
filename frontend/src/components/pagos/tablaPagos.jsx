function TablaPagos({ pagos }) {
    return (
      <div className="overflow-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Folio</th>
              <th className="px-4 py-2">N° Pago</th>
              <th className="px-4 py-2">Monto</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Contrato</th>
            </tr>
          </thead>
          <tbody>
            
          </tbody>
        </table>
      </div>
    );
  }
  export default TablaPagos;
  