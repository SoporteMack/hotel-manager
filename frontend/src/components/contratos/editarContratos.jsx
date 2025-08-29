import { Description, Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import { listaActivosInquilinos } from "../../api/Inquilinos";
import { departamentosactivosyactual } from "../../api/departamentos";
import { useEffect, useState, useRef } from "react";
import Lista from "../items/lista";
import { actualizargeneral } from '../../api/contratos';
import { Notyf } from 'notyf';
function editarContrato({ onClose, isOpen, setIsOpen, contrato, setData, setIsOpenloader }) {
    const [listaInquilinos, setListaInquilinos] = useState([]);
    const [listaDepartamentos, setListaDepartamentos] = useState([]);
    const [inquilinos, setInquilinos] = useState(null);
    const [departamento, setDepartamento] = useState(null);
    const [idContrato, setIdContrato] = useState();
    const [idPersona, setIdPersona] = useState();
    const [numDepartamento, setNumDepartamento] = useState();
    const [deposito, setDeposito] = useState();
    const [deuda, setDeuda] = useState();
    const [fechaInicio, setFechaInicio] = useState();
    const [fechaTermino, setFechaTermino] = useState();
    const [estatus,setEstatus] = useState();
    const [errores, setErrores] = useState({});
    const notyf = useRef(new Notyf({
        duration: 10000,
        dismissible: true,
        position: { x: 'center', y: 'top' },
    }));
    useEffect(() => {
        cargarListas(contrato);
        setIdContrato(contrato.idContrato);
        setDeuda(contrato.deuda);
        setDeposito(contrato.deposito);
        setFechaInicio(contrato.fechaInicio);
        setFechaTermino(contrato.fechaTermino);
        setEstatus(contrato.estatus)
    }, []);
    const cargarListas = async (contrato) => {
        try {
            const [resInq, resDeptos] = await Promise.all([
                listaActivosInquilinos(),
                departamentosactivosyactual(contrato.numDepartamento),
            ]);
            setListaInquilinos(
                resInq.data.lista.map((i) => ({
                    value: i.idPersona,
                    label: `${i.nombrePersona} ${i.apellidoPaterno} ${i.apellidoMaterno}`,
                }))
            );
            setListaDepartamentos(
                resDeptos.data.lista.map((d) => ({
                    value: d.numDepartamento,
                    label: d.descripcion,
                }))
            );
        } catch (error) {
            console.log(error)
            notyf.current.error("error al cargar los datos");
        }
    };
    const handleChange = async (e) =>{
        const { name, value, type, checked } = e.target;
        setEstatus(type === 'checkbox' ? checked : value)
    }
    const handleguardar = async (e) => {
        e.preventDefault();
        setIsOpenloader(true);
        setIsOpen(false);
        const erroresValidacion = validarContrato({ idPersona, numDepartamento, deuda, deposito, fechaInicio, fechaTermino });
        setErrores(erroresValidacion);
        if (Object.keys(erroresValidacion).length > 0) { setIsOpenloader(false); setIsOpen(true); return };

        const payload = {
            idContrato,
            idPersona,
            numDepartamento,
            deposito,
            deuda,
            fechaInicio,
            fechaTermino
        };

        try {
            await actualizargeneral(payload); // axios o fetch debe enviar JSON
            notyf.current.success("Contrato actualizado correctamente");
        } catch (error) {
            notyf.current.error("Error al actualizar contrato");
        } finally {
            setIsOpenloader(false);
            setIsOpen(true)
        }
    };


    // Función de validación independiente
    const validarContrato = ({ idPersona, numDepartamento, deuda, deposito, fechaInicio, fechaTermino }) => {
        const errores = {};

        if (!idPersona) errores.idPersona = "Selecciona una persona";
        if (!numDepartamento) errores.numDepartamento = "Selecciona un departamento";
        if (!deuda || isNaN(deuda)) errores.deuda = "Ingresa una deuda válida";
        if (!deposito || isNaN(deposito)) errores.deposito = "Ingresa un depósito válido";
        if (!fechaInicio) errores.fechaInicio = "Selecciona fecha de inicio";
        if (!fechaTermino) errores.fechaTermino = "Selecciona fecha de término";

        return errores;
    };

    return (
        <Dialog open={isOpen} onClose={onClose} as="div" className="relative z-50 w-full h-100">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/50 backdrop-blur-sm duration-300 ease-out data-closed:opacity-0"
            />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel
                    transition
                    className="w-full max-w-4xl  rounded-2xl bg-white shadow-xl overflow-hidden transform transition-all duration-300"
                >
                    <form onSubmit={handleguardar}>
                        <div className="p-6 md:p-8 space-y-6 ">
                            <div className="border-b pb-4">
                                <DialogTitle className="text-2xl font-bold text-gray-800">Departamento {contrato.departamento.descripcion}</DialogTitle>
                                <Description className="text-gray-500">Información sobre el contrato de arrendamineto de la persona {('\n', contrato.persona.nombrePesona)} {contrato.persona.apellidoPaterno} {contrato.persona.apellidoMaterno}</Description>
                            </div>
                            <div className="overflow-x-auto h-[40vh]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 ">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Persona *</label>
                                        <Lista options={listaInquilinos} value={inquilinos} defaultValue={contrato.idPersona} onChange={setIdPersona} />
                                        {errores.idPersona && <p className="text-red-500 text-sm">{errores.idPersona}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
                                        <Lista options={listaDepartamentos} value={departamento} defaultValue={contrato.numDepartamento} onChange={setNumDepartamento} />
                                        {errores.numDepartamento && <p className="text-red-500 text-sm">{errores.numDepartamento}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                                    <div className="">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Deuda *</label>
                                        <input
                                            type="text"
                                            onChange={(e) => setDeuda(e.target.value)}
                                            defaultValue={contrato.deuda}
                                            className="w-full border border-gray-300 rounded px-4 py-2 pl-10 text-sm focus:outline-none focus:ring focus:ring-blue-200" />
                                        {errores.deuda && <p className="text-red-500 text-sm">{errores.deuda}</p>}

                                    </div>
                                    <div className="">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Deposito *</label>
                                        <input
                                            type="text"
                                            onChange={(e) => setDeposito(e.target.value)}
                                            defaultValue={contrato.deposito}
                                            className="w-full border border-gray-300 rounded px-4 py-2 pl-10 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                                        />
                                        {errores.deposito && <p className="text-red-500 text-sm">{errores.deposito}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                                    <div className="">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio *</label>
                                        <input
                                            type="date"
                                            defaultValue={contrato.fechaInicio}
                                            onChange={(e) => setFechaInicio(e.target.value)}
                                            className="w-full border border-gray-300 rounded px-4 py-2 pl-10 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                                        />
                                        {errores.fechaInicio && <p className="text-red-500 text-sm">{errores.fechaInicio}</p>}
                                    </div>
                                    <div className="">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Termino *</label>
                                        <input
                                            type="date"
                                            onChange={(e) => setFechaTermino(e.target.value)}
                                            defaultValue={contrato.fechaTermino}
                                            className="w-full border border-gray-300 rounded px-4 py-2 pl-10 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                                        />
                                        {errores.fechaTermino && <p className="text-red-500 text-sm">{errores.fechaTermino}</p>}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-700">Estatus</span>
                                        <label htmlFor="estatus" className="relative cursor-pointer">
                                            <input
                                                id="estatus"
                                                type="checkbox"
                                                name="estatus"
                                                defaultChecked={contrato.estatus}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
                                            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-full"></div>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-10">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Guardar
                                    </button>

                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                                    >
                                        Cancelar
                                    </button>
                                </div>

                            </div>

                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
}

export default editarContrato;