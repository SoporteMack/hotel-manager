import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const handleLogout = () => logout();

  const rentaLinks = [
    {
      to: "/inicio", label: "Inicio", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      to: "/departamentos", label: "Departamentos", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <path d="M9 3v18M15 3v18" />
          <path d="M3 9h18M3 15h18" />
        </svg>
      )
    },
    {
      to: "/inquilinos", label: "Inquilinos", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="7" r="4" />
          <path d="M6 21v-2a4 4 0 0 1 8 0v2M18 21v-2a4 4 0 0 0-8 0v2" />
        </svg>
      )
    },
    {
      to: "/crearcontrato", label: "Crear Contrato", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M16 13v6M13 16h6" />
        </svg>
      )
    },
    {
      to: "/contratos", label: "Contratos", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" viewBox="0 0 24 24">
          <path d="M3 7h18v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
          <path d="M16 3v4H8V3" />
        </svg>
      )
    },
    {
      to: "/agregarpago", label: "Agregar Pago", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" viewBox="0 0 24 24">
          <rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
          <circle cx="12" cy="12" r="2" />
          <path d="M16 8v4M14 10h4" />
        </svg>
      )
    },
  ];

  const pensionLinks = [
    {
      to: "/pension/personas", label: "Personas", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="7" r="4" />
          <path d="M6 21v-2a4 4 0 0 1 8 0v2M18 21v-2a4 4 0 0 0-8 0v2" />
        </svg>
      )
    },
    {
      to: "/pension/tarifas", label: "Tarifas", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      )
    },
    {
      to: "/pension/pensiones", label: "Pensiones", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )
    },
    {
      to: "/pension/pagos", // ruta a la vista de pagos
      label: "Pagos",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M4 6h16M4 12h16M4 18h16" /> {/* icono tipo lista */}
        </svg>
      ),
    }

  ];

  return (
    <div
      className={`fixed z-40 inset-y-0 left-0 w-60 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:translate-x-0`}
    >
      <div className="flex flex-col h-full min-h-screen justify-between bg-white p-4 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {/* RENTAS */}
          <details className="flex flex-col gap-2 border-b border-gray-200 pb-2 group">
            <summary className="flex justify-between items-center text-[#121516] text-base font-medium cursor-pointer select-none py-2 px-3 rounded-lg hover:bg-gray-100 transition">
              RENTAS
              <span className="transition-transform duration-300 group-open:rotate-90">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </summary>
            <div className="flex flex-col mt-2 pl-2 space-y-1">
              {rentaLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${isActive
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "hover:bg-gray-100 text-gray-600"
                    }`
                  }
                >
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              ))}
              {user?.rol === "admin" && (
                <>
                  <NavLink
                    to="/pagos"
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${isActive
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "hover:bg-gray-100 text-gray-600"
                      }`
                    }
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4 4h16v16H4z" />
                      <path d="M4 10h16M4 14h16" />
                      <circle cx="8" cy="8" r="1" fill="currentColor" />
                      <circle cx="8" cy="12" r="1" fill="currentColor" />
                      <circle cx="8" cy="16" r="1" fill="currentColor" />
                    </svg>
                    <span className="text-sm">Lista de Pagos</span>
                  </NavLink>
                </>
              )}

            </div>
          </details>

          {/* PENSIONES */}
          <details className="flex flex-col gap-2 border-b border-gray-200 pb-2 group">
            <summary className="flex justify-between items-center text-[#121516] text-base font-medium cursor-pointer select-none py-2 px-3 rounded-lg hover:bg-gray-100 transition">
              PENSIONES
              <span className="transition-transform duration-300 group-open:rotate-90">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </summary>
            <div className="flex flex-col mt-2 pl-2 space-y-1">
              {pensionLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${isActive
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "hover:bg-gray-100 text-gray-600"
                    }`
                  }
                >
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </details>
          <button
            onClick={handleLogout}
            className="mt-2 flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 16l4-4-4-4M21 12H9M13 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8" />
            </svg>
            <span>Cerrar sesión</span>
          </button>
          <NavLink
            to="/config"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${isActive
                ? "bg-blue-100 text-blue-700 font-medium"
                : "hover:bg-gray-100 text-gray-600"
              }`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .69.28 1.35.77 1.82.49.47 1.13.74 1.82.74z" />
            </svg>
            <span className="text-sm">Configuración</span>
          </NavLink>
        </div>

      </div>

    </div>

  );
}

export default Sidebar;
