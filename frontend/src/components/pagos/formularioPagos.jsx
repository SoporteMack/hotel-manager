import { useState } from "react";
import { Switch } from "@headlessui/react";

function FormularioPago({ onClose, recargar }) {
  const [form, setForm] = useState({
    numPago: "",
    monto: "",
    fechaPago: "",
    idContrato: "",
  });

  const [notificar, setNotificar] = useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", { ...form, notificar });
    // Aquí puedes enviar a la API
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-xl shadow space-y-4">
    <h2 className="text-xl font-semibold text-gray-800">Registrar Pago</h2>

    <input
      name="numPago"
      type="number"
      placeholder="Número de Pago"
      required
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
      onChange={handleChange}
    />

    <input
      name="monto"
      type="number"
      step="0.01"
      placeholder="Monto"
      required
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
      onChange={handleChange}
    />

    <input
      name="fechaPago"
      type="date"
      required
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
      onChange={handleChange}
    />

    <input
      name="idContrato"
      type="number"
      placeholder="ID Contrato"
      required
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
      onChange={handleChange}
    />

    <div className="flex items-center justify-between">
      <label className="text-gray-700 font-medium">Notificar por WhatsApp</label>
      <Switch
        checked={notificar}
        onChange={setNotificar}
        className={`${
          notificar ? "bg-green-600" : "bg-gray-300"
        } relative inline-flex h-6 w-11 items-center rounded-full transition`}
      >
        <span
          className={`${
            notificar ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform bg-white rounded-full transition`}
        />
      </Switch>
    </div>

    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
    >
      Guardar Pago
    </button>
  </form>
  );
}

export default FormularioPago;
