import { useState, useEffect, useRef } from "react";
import { Notyf } from "notyf";
import { config as lconfig, actualizarConfiguracion } from "../../api/config";
import "notyf/notyf.min.css";

export default function ConfiguracionMensajes() {
    const notyf = useRef(new Notyf({
        duration: 7000,
        dismissible: true,
        position: { x: "center", y: "top" },
    }));

    const [mensajes, setMensajes] = useState({
        telefonoActual: "",
        bienvenida: "",
        envioNotas: "",
        envioContrato: "",
        vencimiento3Dias: "",
        vencimiento1Dia: ""
    });

    const [loading, setLoading] = useState(false);
    const [errores, setErrores] = useState({});

    useEffect(() => {
        const cargarMensajes = async () => {
            setLoading(true);
            try {
                const res = await lconfig().then((res) => res.data[0] || {});
                console.log(res)
                setMensajes({
                    telefonoActual: res.telefono ?? "",
                    bienvenida: res.bienvenida ?? "",
                    envioNotas: res.envioNotas ?? "",
                    envioContrato: res.envioContrato ?? "",
                    vencimiento3Dias: res.vencimiento3Dias ?? "",
                    vencimiento1Dia: res.vencimiento1Dia ?? ""
                });
            } catch (error) {
                notyf.current.error("Error al cargar mensajes");
            } finally {
                setLoading(false);
            }
        };
        cargarMensajes();
    }, []);

    const handleChange = (e) => {
        setMensajes(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validar = () => {
        const errs = {};
        Object.entries(mensajes).forEach(([key, val]) => {
            if (!val.trim()) errs[key] = "Este campo es obligatorio";
        });
        setErrores(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validar()) {
            notyf.current.error("Corrige los errores antes de guardar");
            return;
        }
        setLoading(true);
        try {
            await actualizarConfiguracion(mensajes);
            notyf.current.success("Mensajes actualizados correctamente");
        } catch (error) {
            notyf.current.error("Error al actualizar mensajes");
        } finally {
            setLoading(false);
        }
    };

    const campos = [
        { label: "Mensaje de Bienvenida", name: "bienvenida", icon: "👋" },
        { label: "Mensaje de Envío de Notas", name: "envioNotas", icon: "📝" },
        { label: "Mensaje de Envío de Contrato", name: "envioContrato", icon: "📄" },
        { label: "Vencimiento (3 días antes)", name: "vencimiento3Dias", icon: "⏳" },
        { label: "Vencimiento (1 día antes)", name: "vencimiento1Dia", icon: "⚠️" }
    ];

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 text-center">Configuración de Mensajes</h2>
            {loading && <p className="text-center text-gray-600">Cargando...</p>}

            <form onSubmit={handleSubmit} noValidate className="grid gap-6 md:grid-cols-2">
                {campos.map(({ label, name, icon }) => (
                    <div key={name} className="bg-white shadow-md rounded-lg p-4 flex flex-col">
                        <div className="flex items-center mb-2">
                            <span className="text-xl mr-2">{icon}</span>
                            <label htmlFor={name} className="font-semibold text-gray-700">{label}</label>
                        </div>
                        <textarea
                            id={name}
                            name={name}
                            value={mensajes[name]}
                            onChange={(e) => {
                                if (e.target.value.length <= 250) {
                                    handleChange(e);
                                }
                            }}
                            rows={4}
                            className={`w-full px-3 py-2 border rounded-md resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none ${errores[name] ? "border-red-500" : "border-gray-300"}`}
                            placeholder={`Escribe aquí el mensaje de ${label.toLowerCase()}`}
                        />
                        <p className="text-right text-gray-500 text-sm mt-1">
                            {mensajes[name].length}/250
                        </p>
                        {errores[name] && <p className="text-red-500 text-sm mt-1">{errores[name]}</p>}
                    </div>
                ))}
            </form>

            <div className="text-center mt-6">
                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition disabled:opacity-50"
                >
                    {loading ? "Guardando..." : "Guardar Mensajes"}
                </button>
            </div>
        </div>
    );
}
