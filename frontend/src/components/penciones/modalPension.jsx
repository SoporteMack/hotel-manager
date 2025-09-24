import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition, DialogTitle, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { tarifaA } from "../../api/tarifas";
import Lista from "../items/lista";
import { listaPersonasPensionAdd } from "../../api/personap";
import { tienecom } from "../../api/pensiones";
import { useAuth } from "../../context/authContext";

export default function ModalPension({ isOpen, onClose, onSave, initialData = null }) {
  const [persona, setPersona] = useState();
  const [listaPersonas, setListaPersonas] = useState([]);
  const [llave, setLlave] = useState(false);
  const [tipoPension, setTipoPension] = useState("MENSUAL");
  const [dif, setDif] = useState(0);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fechaInicio: "",
    precioAcordado: "",
    estado: true,
    observaciones: "",
    llave: false,
    tarifas: [] // { idTarifa, cantidad }
  });
  const [tarifasDB, setTarifaDB] = useState([]);
  const opTipoPension = [
    { label: "MENSUAL", value: "MENSUAL" },
    { label: "SEMANAL", value: "SEMANAL" },
    { label: "QUINCENAL", value: "QUINCENAL" }
  ];

  useEffect(() => {
    listartarifas();
    listarPersonas();
  }, []);

  useEffect(() => {
    if (tarifasDB.length > 0) {
      if (initialData) {
        setDif(initialData.precioAcordado);
        setFormData(initialData);
        setPersona(initialData.idPersona);
      } else {
        setFormData(prev => ({
          ...prev,
          tarifas: tarifasDB.map(t => ({ idTarifa: t.idTarifa, cantidad: 0 })), // 👈 cantidad = 0
          fechaInicio: new Date().toISOString().split("T")[0]
        }));
      }
    }
  }, [tarifasDB, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleTarifaChange = (idTarifa, value) => {
    const cantidad = Number(value) || 0;

    setFormData((prev) => {
      const nuevasTarifas = prev.tarifas.map((t) =>
        t.idTarifa === idTarifa ? { ...t, cantidad } : t
      );

      const nuevoPrecio = nuevasTarifas.reduce((total, t) => {
        const tarifaInfo = tarifasDB.find((tar) => tar.idTarifa === t.idTarifa);
        return total + (tarifaInfo ? tarifaInfo.precio * (t.cantidad || 0) : 0);
      }, 0);

      setDif(nuevoPrecio);
      return {
        ...prev,
        tarifas: nuevasTarifas,
        precioAcordado: nuevoPrecio,
      };
    });
  };

  useEffect(() => {
    let factor = 1;
    if (tipoPension === "SEMANAL") factor = 4;
    else if (tipoPension === "QUINCENAL") factor = 2;
    else if (tipoPension === "MENSUAL") factor = 1;

    setFormData(prev => ({
      ...prev,
      tipoPension: tipoPension
    }));
  }, [tipoPension, formData.precioAcordado]);

  const handleSubmit = (e) => {
    e.preventDefault();
    formData.idPersona = persona;
    onSave(formData);
    onClose();
  };

  const listartarifas = async () => {
    try {
      const res = await tarifaA().then(res => { return res.data });
      setTarifaDB(res);
    } catch (error) {
      console.error(error);
    }
  };

  const listarPersonas = async () => {
    const res = await listaPersonasPensionAdd ().then(res => { return res.data });
    setListaPersonas(
      res.map((i) => ({
        value: i.idPersona,
        label: `${i.nombre} ${i.apellido}`,
      }))
    );
  };

  useEffect(() => {
    if (persona) {
      const fetchLlave = async () => {
        const tllave = await com(persona);
        formData.llave = tllave;
        setLlave(tllave);
      };
      fetchLlave();
    }
  }, [persona]);

  const com = async (idPersona) => {
    const res = await tienecom(idPersona);
    return res.data.com;
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog open={isOpen} onClose={onClose} as="div" className="relative z-50 w-full">
        <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">

          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/50 backdrop-blur-sm duration-300 ease-out data-closed:opacity-0"
          />

          <DialogTitle className="text-lg font-bold text-gray-900 mb-4">
            {initialData ? "Editar Pensión" : "Crear Pensión"}
          </DialogTitle>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="w-full max-w-3xl sm:max-w-lg md:max-w-2xl lg:max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden transform transition-all duration-300 p-4 sm:p-6 mx-2 sm:mx-auto max-h-[90vh]">
              <div className="overflow-y-auto max-h-[85vh] pr-2">
                <form className="space-y-6" onSubmit={handleSubmit}>

                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
                    {initialData ? "Editar Pensión" : "Crear Pensión"}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Persona *</label>
                      <Lista options={listaPersonas} value={persona} onChange={setPersona} />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
                      <input
                        type="date"
                        name="fechaInicio"
                        value={formData.fechaInicio}
                        onChange={handleChange}
                        className="w-full md:flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">Precio acordado</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="precioAcordado"
                        value={formData.precioAcordado}
                        disabled={user.rol !== "admin"}
                        onChange={handleChange}
                        className="w-full md:flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">Tipo de Pension*</label>
                      <Lista value={tipoPension} onChange={setTipoPension} options={opTipoPension} />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">Estado:</span>
                      <label htmlFor="estado" className="relative inline-flex items-center cursor-pointer">
                        <input
                          id="estado"
                          type="checkbox"
                          name="estado"
                          checked={formData.estado}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-6"></div>
                      </label>
                      <span className={`text-sm font-medium ${formData.estado ? "text-green-600" : "text-gray-500"}`}>
                        {formData.estado ? "Activo" : "Inactivo"}
                      </span>
                    </div>

                    {llave && (<div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">Llave:</span>
                      <label htmlFor="llave" className="relative inline-flex items-center cursor-pointer">
                        <input
                          id="llave"
                          type="checkbox"
                          name="llave"
                          checked={formData.llave}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-colors duration-300"></div>
                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-6"></div>
                      </label>
                      <span className={`text-sm font-medium ${formData.llave ? "text-blue-600" : "text-gray-500"}`}>
                        {formData.llave ? "Con llave" : "Sin llave"}
                      </span>
                    </div>)}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                    <textarea
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleChange}
                      rows={3}
                      className="w-full md:flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2">Tarifas</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {tarifasDB.map((tarifa) => (
                        <div
                          key={tarifa.idTarifa}
                          className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                          <input
                            type="number"
                            placeholder="Cantidad"
                            min={0}
                            value={formData.tarifas.find(t => t.idTarifa === tarifa.idTarifa)?.cantidad ?? 0}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*$/.test(value)) {
                                handleTarifaChange(tarifa.idTarifa, value);
                              }
                            }}
                            className="w-20 rounded-md border-gray-300 shadow-sm px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <span className="text-gray-800 font-medium">{tarifa.descripcion}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2 bg-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300 w-full sm:w-auto"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 w-full sm:w-auto"
                    >
                      {initialData ? "Guardar cambios" : "Crear"}
                    </button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
