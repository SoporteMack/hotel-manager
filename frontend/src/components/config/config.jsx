import { Tab,TabGroup,TabList,TabPanels,TabPanel } from '@headlessui/react';
import ConfiguracionNotificaciones from './configNoti';
import ConfiguracionBanco from './configBanco';
import ConfiguracionMensajes from './configuracionMensajes';
import { useState } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ConfiguracionTabs() {
  const [loading,setLoading] = useState(false)
  return (
    <div className="w-full max-w-4xl mx-auto mt-6 p-4">
      {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-md flex flex-col items-center gap-3">
                        <div className="loader border-4 border-t-4 border-gray-200 border-t-green-500 rounded-full w-12 h-12 animate-spin"></div>
                        <span className="text-gray-700 font-medium">...</span>
                    </div>
                </div>
            )}
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
            <ConfiguracionNotificaciones setLoadingL ={setLoading}/>
          </TabPanel>

          {/* Datos Bancarios */}
          <TabPanel className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Datos Bancarios</h2>
            <p className="text-gray-600">Agrega o modifica tus datos bancarios aquí.</p>
            <ConfiguracionBanco setLoadingL ={setLoading}/>
          </TabPanel>

          {/* Mensajes */}
          <TabPanel className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Mensajes de Notificaciones</h2>
            <p className="text-gray-600">Aquí se muestran los mensajes y alertas recientes.</p>
            <ConfiguracionMensajes setLoadingL ={setLoading}/>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
