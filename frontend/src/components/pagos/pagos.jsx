import { useMemo, useRef, useState } from "react";
import { Notyf } from "notyf";
import { pagosxfecha } from "../../api/pagos";
import ModalEditarPago from "./modalEditarPago";


function Pagos() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [pagos, setPagos] = useState([]);
  const [search, setSearch] = useState("");
  const [isOpen,setIsOpen] = useState(false);
  const [item,setItem] = useState();
  const onClose = async ()=>{
    setItem();
    setIsOpen(false);
    const fechas = validarFecha();
    if (!fechas) return;

    try {
      const res = await pagosxfecha(fechas.inicio, fechas.fin);
      setPagos(res.data.lista || []);
    } catch (error) {
      notyf.current.error("Error al consultar pagos.");
    }
  }
  const handleEditar = async (pago)=>{
    setItem(pago);
    setIsOpen(true);
  }
  const notyf = useRef(new Notyf({
    duration: 10000,
    dismissible: true,
    position: { x: 'center', y: 'top' },
  }));

  const formatLocalFecha = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const validarFecha = () => {
    if (!fechaInicio && !fechaFinal) {
      notyf.current.error("Debes seleccionar al menos una fecha.");
      return null;
    }

    const parseLocalDate = (str) => {
      const [y, m, d] = str.split("-");
      return new Date(y, m - 1, d);
    };

    let inicio = fechaInicio ? parseLocalDate(fechaInicio) : null;
    let fin = fechaFinal ? parseLocalDate(fechaFinal) : null;

    if (inicio && !fin) fin = new Date(inicio);
    else if (!inicio && fin) inicio = new Date(fin);

    if (inicio > fin) {
      notyf.current.error("La fecha de inicio no puede ser mayor que la fecha final.");
      return null;
    }

    inicio.setHours(0, 0, 0, 0);
    fin.setHours(23, 59, 59, 999);

    return {
      inicio: formatLocalFecha(inicio),
      fin: formatLocalFecha(fin),
    };
  };

  const handleEnviar = async () => {
    const fechas = validarFecha();
    if (!fechas) return;

    try {
      const res = await pagosxfecha(fechas.inicio, fechas.fin);
      setPagos(res.data.lista || []);
    } catch (error) {
      notyf.current.error("Error al consultar pagos.");
    }
  };

  const formatFechaHoraLocal = (fecha) => {
    const f = new Date(fecha);
    const pad = n => n.toString().padStart(2, '0');
    return `${f.getFullYear()}-${pad(f.getMonth() + 1)}-${pad(f.getDate())} ${pad(f.getHours())}:${pad(f.getMinutes())}:${pad(f.getSeconds())}`;
  };

  const items = useMemo(() => {
    return pagos.filter((pago) => {
      const { folio, numPago, monto, fechaPago, contrato } = pago;
      const nombreCompleto = `${contrato?.persona?.nombrePersona ?? ''} ${contrato?.persona?.apellidoPaterno ?? ''} ${contrato?.persona?.apellidoMaterno ?? ''}`.toLowerCase();
      const text = `${folio} ${numPago} ${monto} ${fechaPago} ${nombreCompleto}`.toLowerCase();
      const searchtext = search.toLowerCase();
      return text.includes(searchtext);
    });
  }, [pagos, search]);

  return (
    <section className="h-full p-6 flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-title-section">Pagos</h1>
        <p className="text-sm text-description-section">Gestiona los Pagos registrados en el sistema</p>
      </div>

      <div className="mb-6">
        <input
          type="search"
          placeholder="Buscar Folio,Nombre,Fecha..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:max-w-xs border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3 ">
        <input
          type="date"
          value={fechaInicio}
          onChange={e => setFechaInicio(e.target.value)}
          className="w-full md:w-48 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
        <input
          type="date"
          value={fechaFinal}
          onChange={e => setFechaFinal(e.target.value)}
          className="w-full md:w-48 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button
          type="button"
          className="md:w-48 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
          onClick={handleEnviar}
        >
          Consultar
        </button>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full table-auto text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 font-medium whitespace-nowrap">Folio</th>
              <th className="px-4 py-2 font-medium whitespace-nowrap"># Pago</th>
              <th className="px-4 py-2 font-medium whitespace-nowrap">Nombre</th>
              <th className="px-4 py-2 font-medium whitespace-nowrap">Monto</th>
              <th className="px-4 py-2 font-medium whitespace-nowrap">Fecha de Pago</th>
              <th className="px-4 py-2 font-medium whitespace-nowrap">Editar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((pago, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">{pago.folio}</td>
                <td className="px-4 py-2 whitespace-nowrap">{pago.numPago}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {`${pago.contrato?.persona?.nombrePersona ?? ''} ${pago.contrato?.persona?.apellidoPaterno ?? ''} ${pago.contrato?.persona?.apellidoMaterno ?? ''}`}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  ${pago.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {formatFechaHoraLocal(pago.fechaPago)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button onClick={()=>handleEditar(pago)}>editar</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

{
  item?(<ModalEditarPago isOpen={isOpen} setIsOpen={setIsOpen} onClose={onClose} data={item}/>):(<></>)
}
    </section>
  );
}

export default Pagos;
