import { useEffect, useState } from "react";
import TarjetaInicio from "./inicio/tarjetainicio";
import { pagosdeldia as pagos, ocupacion as totalocupacion, ultimospagos as upagos } from "../api/inicio";
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from "@headlessui/react";
import IngresosDiarios from "./inicio/ingresosdiarios";
import RentasVencidas from "./inicio/rentasvencidas";
import VenceUnDia from "./inicio/venceundia";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Dashboard() {
  const [pagosDelDia, setPagosDelDia] = useState(0);
  const [pagosDelMes,setPagosdelMes] = useState(0);
  const [ocupacion, setOcupacion] = useState({ libres: 0, porcentaje: 0 });

  const obtenerPagosDelDia = async () => {
    try {
      const fecha = new Date();
      const anio = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const dia = String(fecha.getDate()).padStart(2, "0");
      const fechaFormateada = `${anio}-${mes}-${dia}`;
      const res = await pagos(fechaFormateada,fechaFormateada);
      setPagosDelDia(res.data.monto);
    } catch (error) {
      console.error(error);
    }
  };
  const pagosdelmes = async ()=>{
    try {
      const fecha = new Date();
      const anio = fecha.getFullYear();
      const mes = fecha.getMonth() + 1; // 1-12
    
      // Primer día del mes
      const primerDia = `${anio}-${String(mes).padStart(2, "0")}-01`;
    
      // Último día del mes → usar el "0" del mes siguiente
      const ultimoDia = new Date(anio, mes, 0).getDate();
      const ultimoDiaFormateado = `${anio}-${String(mes).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`;
    
      const res = await pagos(primerDia, ultimoDiaFormateado);
      setPagosdelMes(res.data.monto);
    
    } catch (error) {
      console.error(error);
    }
    
  }
  const obtenerOcupacion = async () => {
    try {
      const res = await totalocupacion();
      setOcupacion(res.data || { libres: 0, porcentaje: 0 });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerOcupacion();
    obtenerPagosDelDia();
    pagosdelmes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inicio</h1>
        <p className="text-gray-600">Resumen general de la operación</p>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <TarjetaInicio titulo="Ingresos Diarios" valor={`$${pagosDelDia}`} />
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <TarjetaInicio titulo="Ingresos Mensuales" valor={`$${pagosDelMes}`} />
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <TarjetaInicio titulo="Departamentos Libres" valor={`${ocupacion.libres}`} />
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <TarjetaInicio titulo="Ocupación" valor={`${ocupacion.porcentaje}%`} />
        </div>
      </div>

      {/* Tabs */}
      <TabGroup>
        <TabList className="flex space-x-3 bg-white rounded-xl p-2 shadow mb-6">
          {["Ingresos Diarios", "Vencimientos a 1 Día", "Vencidos"].map((tabName) => (
            <Tab
              key={tabName}
              className={({ selected }) =>
                classNames(
                  "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all",
                  selected
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )
              }
            >
              {tabName}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          <TabPanel className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Ingresos de la Semana</h2>
            <p className="text-gray-600">Aquí se mostrarán los gráficos o datos.</p>
            <IngresosDiarios/>
          </TabPanel>

          <TabPanel className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Vencimientos a 1 Día</h2>
            <p className="text-gray-600">Aquí se mostrarán los vencimientos próximos.</p>
            <VenceUnDia/>
          </TabPanel>

          <TabPanel className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Departamentos Vencidos</h2>
            <p className="text-gray-600">Aquí aparecerán los pagos atrasados.</p>
            <RentasVencidas/>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}

export default Dashboard;
