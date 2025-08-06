import { useState, useEffect } from "react";

function ModalDepartamento({ visible, onClose, onGuardar, departamento }) {
  const [formData, setFormData] = useState({
    descripcion: "",
    costo: "",
    estatus: true,
  });

  useEffect(() => {
    if (departamento) {
      setFormData({
        descripcion: departamento.descripcion || "",
        costo: departamento.costo || "",
        estatus: departamento.estatus ?? true,
      });
    } else {
      setFormData({
        descripcion: "",
        costo: "",
        estatus: true,
      });
    }
  }, [departamento]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(formData);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {departamento ? "Editar Departamento" : "Agregar Departamento"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="descripcion">
              Número de Departamento
            </label>
            <input
              type="text"
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="costo">
              Costo
            </label>
            <input
              type="number"
              id="costo"
              name="costo"
              value={formData.costo}
              onChange={handleChange}
              required
              min="0"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          {/* Estatus */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">Estado:</span>

            <label htmlFor="estatus" className="relative cursor-pointer">
              <input
                id="estatus"
                type="checkbox"
                name="estatus"
                checked={formData.estatus}
                onChange={handleChange}
                className="sr-only peer"
              />
              {/* Switch visual */}
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-full"></div>
            </label>

            {/* Texto dinámico a la derecha del switch */}
            <span className="text-sm text-gray-600">
              {formData.estatus ? "Desocupado" : "Ocupado"}
            </span>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              checked
              onClick={onClose}
              className="text-btn-cancel-modal hover:underline text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md border border-btn-border-edit to-btn-text-edit cursor-pointer select-none font-semibold
         hover:text-btn-text-hover-edit hover:border-btn-text-hover-edit transition-colors duration-200 p-2"
            >
              {departamento ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalDepartamento;
