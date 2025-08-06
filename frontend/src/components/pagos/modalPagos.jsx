import { Description, Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'

function ModalPago({ onClose, isOpen, setIsOpen, inquilinos,setData}) {
  const handledata =(data)=>
  {
    setData(data);
    setIsOpen(false);
  }
  return (
    <Dialog open={isOpen} onClose={onClose} as="div" className="relative z-50 w-full">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/50 backdrop-blur-sm duration-300 ease-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-full max-w-4xl rounded-2xl bg-white shadow-xl overflow-hidden transform transition-all duration-300"
        >
          <div className="p-6 md:p-8 space-y-6">
            <div className="border-b pb-4">
              <DialogTitle className="text-2xl font-bold text-gray-800">Inquilinos</DialogTitle>
              <Description className="text-gray-500">Coincidencia de búsqueda por nombre</Description>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># Departamento</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Deuda</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inquilinos && inquilinos.length > 0 ? (
                    inquilinos.map((inquilino, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${inquilino.persona.nombrePersona} ${inquilino.persona.apellidoPaterno} ${inquilino.persona.apellidoMaterno}`}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{inquilino.departamento.descripcion}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{inquilino.deuda}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={()=>{handledata(inquilino)}}>Agregar Pago</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-4 text-center text-sm text-gray-500">
                        No se encontró coincidencia
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
            </div>
            
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default ModalPago;