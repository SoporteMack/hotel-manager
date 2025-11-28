import { useEffect, useState } from 'react';
import { reporteEstadoPagos as fetchReporte } from '../../api/pagos';
import { Notyf } from 'notyf';

function ReporteEstadoPagos() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');

  const notyf = new Notyf({
    duration: 5000,
    dismissible: true,
    position: { x: 'center', y: 'top' },
  });

  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Obtener nombres de los últimos 3 meses
  const hoy = new Date();
  const mesActual = nombresMeses[hoy.getMonth()];
  const mesAnterior = nombresMeses[(hoy.getMonth() + 11) % 12];
  const hace2Meses = nombresMeses[(hoy.getMonth() + 10) % 12];

  useEffect(() => {
    cargarReporte();
  }, []);

  const cargarReporte = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchReporte();
      const rawData = Array.isArray(response.data.data) ? response.data.data : [];

      // Procesar los meses, dejar vacío si no hay cobro
      const datosProcesados = rawData.map((item) => ({
        ...item,
        mes3: item.mes3 === null ? '' : item.mes3, // Mes Actual
        mes2: item.mes2 === null ? '' : item.mes2, // Mes Anterior
        mes1: item.mes1 === null ? '' : item.mes1, // Hace 2 Meses
      }));

      setDatos(datosProcesados);
    } catch (err) {
      setError('Error al cargar el reporte');
      notyf.error('Error al cargar el reporte');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const datosFiltrados = datos.filter(
    (item) =>
      item.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      item.departamento.toLowerCase().includes(filtro.toLowerCase())
  );

  const getEstadoColor = (estado) => {
    if (estado === 'Pagado') return 'bg-green-100 text-green-800';
    if (estado === 'Pendiente') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getDeudaColor = (deuda) => {
    if (deuda === 0) return 'text-green-600 font-bold';
    if (deuda > 0 && deuda <= 1000) return 'text-orange-600 font-bold';
    return 'text-red-600 font-bold';
  };

  return (
    <section className="flex-1 flex flex-col h-full p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Reporte Estado de Pagos</h1>
        <p className="text-sm text-gray-500">Historial de pagos de los últimos 3 meses</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre o departamento..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full md:flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={cargarReporte}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Departamento</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">{mesActual}</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">{mesAnterior}</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">{hace2Meses}</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Deuda 3 Meses</th>
                </tr>
              </thead>
              <tbody>
                {datosFiltrados.length > 0 ? (
                  datosFiltrados.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-sm text-gray-700">{item.departamento}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.nombre}</td>
                      <td className="px-4 py-3 text-center text-sm">
                        {item.mes3 ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(item.mes3)}`}>
                            {item.mes3}
                          </span>
                        ) : (
                          ''
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {item.mes2 ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(item.mes2)}`}>
                            {item.mes2}
                          </span>
                        ) : (
                          ''
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {item.mes1 ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(item.mes1)}`}>
                            {item.mes1}
                          </span>
                        ) : (
                          ''
                        )}
                      </td>
                      <td className={`px-4 py-3 text-right text-sm ${getDeudaColor(item.deuda)}`}>
                        ${parseFloat(item.deuda).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      No se encontraron registros
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {datosFiltrados.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
              Total de registros: <strong>{datosFiltrados.length}</strong>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default ReporteEstadoPagos;
