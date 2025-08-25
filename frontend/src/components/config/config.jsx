import { Tab,TabGroup,TabList,TabPanels,TabPanel } from '@headlessui/react';
import ConfiguracionNotificaciones from './configNoti';
import ConfiguracionBanco from './configBanco';
import ConfiguracionMensajes from './configuracionMensajes';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ConfiguracionTabs() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-6 p-4">
      <TabGroup>
        {/* Tabs */}
        <TabList className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 bg-gray-100 p-2 rounded-xl overflow-x-auto">
          {['Notificaciones', 'Datos Bancarios', 'Mensajes'].map((tabName) => (
            <Tab
              key={tabName}
              className={({ selected }) =>
                classNames(
                  'flex-1 py-3 px-6 text-base font-semibold text-center rounded-xl transition-all duration-300',
                  selected
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-blue-100'
                )
              }
            >
              {tabName}
            </Tab>
          ))}
        </TabList>

        {/* Paneles */}
        <TabPanels className="mt-6">
          {/* Notificaciones */}
          <TabPanel className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Configuración de Notificaciones</h2>
            <p className="text-gray-600 mb-6">
              Aquí puedes activar o desactivar las notificaciones de tu aplicación.
            </p>
            <ConfiguracionNotificaciones />
          </TabPanel>

          {/* Datos Bancarios */}
          <TabPanel className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Datos Bancarios</h2>
            <p className="text-gray-600">Agrega o modifica tus datos bancarios aquí.</p>
            <ConfiguracionBanco/>
          </TabPanel>

          {/* Mensajes */}
          <TabPanel className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Mensajes de Notificaciones</h2>
            <p className="text-gray-600">Aquí se muestran los mensajes y alertas recientes.</p>
            <ConfiguracionMensajes/>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
