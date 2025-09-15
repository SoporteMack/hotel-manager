import React, { useEffect, useState, Fragment } from 'react'
import { Dialog, Transition, TransitionChild, DialogTitle, DialogBackdrop } from '@headlessui/react'

// Componente Modal para crear/editar tarifas
// Props:
// - isOpen: boolean
// - onClose: () => void
// - onSave: async (data) => { /* guarda en backend y devuelve resultado */ }
// - initialData: { idTarifa, precio, descripcion, estado } | null
// - mode: 'create' | 'edit' (opcional)

export default function ModalTarifas({ isOpen, onClose, onSave, initialData = null, mode = 'create' }) {
    const [precio, setPrecio] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [estado, setEstado] = useState(true)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (initialData) {
            setPrecio(initialData.precio != null ? String(initialData.precio) : '')
            setDescripcion(initialData.descripcion || '')
            setEstado(initialData.estado == null ? true : Boolean(initialData.estado))
        } else {
            // limpiar cuando se abre en modo crear
            setPrecio('')
            setDescripcion('')
            setEstado(true)
        }
        setErrors({})
    }, [initialData, isOpen])

    const validar = () => {
        const e = {}
        // precio: debe ser número positivo
        if (!precio || isNaN(Number(precio))) e.precio = 'Precio inválido'
        else if (Number(precio) < 0) e.precio = 'El precio debe ser mayor o igual a 0'

        if (!descripcion || descripcion.trim().length < 3) e.descripcion = 'La descripción es muy corta'

        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        if (!validar()) return
        setLoading(true)
        try {
            const payload = {
                precio: Number(precio),
                descripcion: descripcion.trim(),
                estado: Boolean(estado)
            }

            // Si viene initialData y tiene idTarifa, lo incluimos (útil para el controlador)
            if (initialData && initialData.idTarifa) payload.idTarifa = initialData.idTarifa

            // onSave debe encargarse de la petición al backend (POST/PUT)
            await onSave(payload)
            onClose()
        } catch (err) {
            // Puedes mapear errores del servidor a la UI
            console.error(err)
            setErrors({ server: err.message || 'Error al guardar' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-40 overflow-y-auto" onClose={onClose}>
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm duration-300 ease-out data-closed:opacity-0"
                />
                <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">

                    {/* centrar modal */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>

                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-2xl px-6 pt-5 pb-6 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <DialogTitle as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                {mode === 'create' ? 'Crear tarifa' : 'Editar tarifa'}
                            </DialogTitle>

                            <form className="mt-4" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Precio</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={precio}
                                            onChange={(e) => setPrecio(e.target.value)}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.precio ? 'border-red-500' : ''}`}
                                            placeholder="0.00"
                                        />
                                        {errors.precio && <p className="text-sm text-red-600 mt-1">{errors.precio}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                        <textarea
                                            value={descripcion}
                                            onChange={(e) => setDescripcion(e.target.value)}
                                            rows={3}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.descripcion ? 'border-red-500' : ''}`}
                                            placeholder="Descripción de la tarifa"
                                        />
                                        {errors.descripcion && <p className="text-sm text-red-600 mt-1">{errors.descripcion}</p>}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-700">Estado:</span>
                                        <label htmlFor="estado" className="relative cursor-pointer">
                                            <input
                                                id="estado"
                                                type="checkbox"
                                                checked={estado}
                                                onChange={(e) => setEstado(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
                                            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-full"></div>
                                        </label>
                                        <span className="text-sm text-gray-600">
                                            {estado ? "Activo" : "Inactivo"}
                                        </span>
                                    </div>


                                    {errors.server && <p className="text-sm text-red-600">{errors.server}</p>}
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button type="button" onClick={onClose} className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                                    >
                                        {loading ? (mode === 'create' ? 'Creando...' : 'Guardando...') : (mode === 'create' ? 'Crear' : 'Guardar cambios')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    )
}
