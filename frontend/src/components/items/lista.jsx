import { useState, useEffect, useRef } from "react";

function Lista({ options, value, defaultValue, onChange }) {
  const [open, setOpen] = useState(false);
  const listaRef = useRef(null);

  // ✅ Si no hay value, tomar el defaultValue
  useEffect(() => {
    if (!value && defaultValue) {
      onChange(defaultValue);
    }
  }, [value, defaultValue, onChange]);

  // ✅ Etiqueta seleccionada
  const selectedLabel =
    options.find(opt => opt.value === value)?.label ||
    options.find(opt => opt.value === defaultValue)?.label ||
    "Selecciona...";

  // Cerrar si se hace clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (listaRef.current && !listaRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={listaRef}>
      {/* Botón principal */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left text-text-form
                   focus:outline-none focus:ring-2 focus:ring-focus-form focus:bg-focus-form
                   flex justify-between items-center cursor-pointer"
      >
        <span>{selectedLabel}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Opciones */}
      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map(opt => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`cursor-pointer px-3 py-2 hover:bg-hover-primary hover:text-text-secondary ${
                value === opt.value ? "bg-gray-100 font-semibold" : ""
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Lista;
