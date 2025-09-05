import { useState, useEffect } from "react";
import { detalles, crearDetalle } from "../../api/departamentos";

function ModalDepartamento({ visible, onClose, onGuardar, departamento }) {
  const [formData, setFormData] = useState({
    descripcion: "",
    costo: "",
    estatus: true,
    detalles: [], // IDs seleccionados
  });
  const [opcionesDetalles, setOpcionesDetalles] = useState([]);
  const [nuevoDetalle, setNuevoDetalle] = useState("");

  // Cargar detalles desde la BD (solo una vez)
  useEffect(() => {
    
    cargarDetalles();
  }, []);

  // Autorrellenar formulario al editar
useEffect(() => {
  if (departamento) {
    setFormData({
      descripcion: departamento.descripcion || "",
      costo: departamento.costo || "",
      estatus: departamento.estatus ?? true,
      detalles: departamento.detalles
        ?.filter((d) => d && d.idDetalle) // filtrar nulos
        .map((d) => d.idDetalle) || [],   // extraer solo IDs
    });
  } else {
    setFormData({
      descripcion: "",
      costo: "",
      estatus: true,
      detalles: [],
    });
  }
}, [departamento]);

const cargarDetalles = async function () {
  try {
    const data = await detalles().then((res) => res.data);

    // Normalizar: forzar a que todos tengan {idDetalle, descripcion}
    const normalizados = data.map((d) => ({
      idDetalle: d.idDetalle,
      descripcion: d.descripcion || d.descripcionDetalle || "Sin nombre",
    }));

    // Eliminar duplicados por idDetalle
    const unicos = normalizados.filter(
      (item, index, self) =>
        index === self.findIndex((d) => d.idDetalle === item.idDetalle)
    );

    setOpcionesDetalles(unicos);
  } catch (error) {
    console.error("Error al cargar detalles:", error);
  }
}
  // Manejar cambios de input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "detalles") {
      const id = parseInt(value);
      setFormData((prev) => ({
        ...prev,
        detalles: checked
          ? [...prev.detalles, id]
          : prev.detalles.filter((d) => d !== id),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Agregar un nuevo detalle
  const handleAgregarDetalle = async () => {
    if (!nuevoDetalle.trim()) return;

    try {
      const res = await crearDetalle({ descripcion: nuevoDetalle });
      cargarDetalles();
      setNuevoDetalle("");
    } catch (error) {
      console.error("Error al agregar detalle:", error);
    }
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
          {/* Descripción */}
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

          {/* Costo */}
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
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-full"></div>
            </label>
            <span className="text-sm text-gray-600">
              {formData.estatus ? "Desocupado" : "Ocupado"}
            </span>
          </div>

          {/* Detalles seleccionables */}
          <div>
            <span className="block text-sm font-medium mb-1">Detalles:</span>
            <div className="flex flex-wrap gap-2 mb-2">
              {opcionesDetalles.map((detalle) => (
                <label key={detalle.idDetalle} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="detalles"
                    value={detalle.idDetalle}
                    checked={formData.detalles.includes(detalle.idDetalle)}
                    onChange={handleChange}
                  />
                  <span className="text-sm">{detalle.descripcion || "Sin nombre"}</span>
                </label>
              ))}
            </div>

            {/* Agregar nuevo detalle */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nuevo detalle..."
                value={nuevoDetalle}
                onChange={(e) => setNuevoDetalle(e.target.value)}
                className="flex-1 border px-3 py-2 rounded text-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={handleAgregarDetalle}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition text-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Botones */}
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
              className="px-4 py-2 rounded-md border border-btn-border-edit text-btn-text-edit cursor-pointer font-semibold hover:text-btn-text-hover-edit hover:border-btn-text-hover-edit transition-colors duration-200 p-2"
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
