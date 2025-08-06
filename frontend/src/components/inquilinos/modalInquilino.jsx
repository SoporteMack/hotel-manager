import { useEffect, useState } from 'react';

function ModalInquilino({ visible, onClose, onGuardar, item = null }) {
  const [formData, setFormData] = useState({
    nombrePersona: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    telefono: '',
    correo: '',
    estatus: true,
  });

  // ⛏️ Efecto para llenar los datos cuando abres el modal con "item"
  useEffect(() => {
    if (item) {
      setFormData({
        nombrePersona: item.nombrePersona || '',
        apellidoPaterno: item.apellidoPaterno || '',
        apellidoMaterno: item.apellidoMaterno || '',
        telefono: item.telefono || '',
        correo: item.correo || '',
        estatus: item.estatus !== undefined ? item.estatus : true,
      });
    } else {
      setFormData({
        nombrePersona: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        telefono: '',
        correo: '',
        estatus: true,
      });
    }
  }, [item]); // <-- importante que se vuelva a ejecutar cuando cambie "item"

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(formData); // llama a guardar o actualizar
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4 sm:px-0">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-lg font-semibold mb-4 text-center">
          {item ? 'Editar Inquilino' : 'Agregar Inquilino'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nombrePersona"
            placeholder="Nombre"
            value={formData.nombrePersona}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm"
            required
            autoComplete="off"
          />
          <input
            name="apellidoPaterno"
            placeholder="Apellido Paterno"
            value={formData.apellidoPaterno}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm"
            required
            autoComplete="off"
          />
          <input
            name="apellidoMaterno"
            placeholder="Apellido Materno"
            value={formData.apellidoMaterno}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm"
            autoComplete="off"
          />
          <input
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm"
            required
            autoComplete="off"
          />
          <input
            name="correo"
            type="email"
            placeholder="Correo"
            value={formData.correo}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm"
            autoComplete="off"
          />

          {/* Estatus */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">Estatus</span>
            <label htmlFor="estatus" className="relative cursor-pointer">
              <input
                id="estatus"
                type="checkbox"
                name="estatus"
                checked={formData.estatus}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-full"></div>
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-btn-cancel-modal hover:underline text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 text-sm"
            >
              {item ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalInquilino;
