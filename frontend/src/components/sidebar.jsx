import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const handleLogout = () => {
    logout();
  }
  return (
    <div
      className={`fixed z-40 inset-y-0 left-0 w-60 bg-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:translate-x-0`}
    >
      <div className="flex h-full min-h-[700px] flex-col justify-between bg-white p-4">
        <div className="flex flex-col gap-4">

          <h1 className="text-[#121516] text-base font-medium leading-normal">RENTAS</h1>

          <div className="flex flex-col gap-2">

            {/** Dashboard */}
            <NavLink
              to="/inicio"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-200 ${isActive ? 'bg-item-sidebar-active text-black' : 'hover:bg-gray-100 text-gray-600'
                }`
              }
            >
              <div className="text-inherit">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="text-sm">Inicio</span>
            </NavLink>


            {/**Departamento */}
            <NavLink
              to="/departamentos"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-200 ${isActive ? 'bg-item-sidebar-active text-black' : 'hover:bg-gray-100 text-gray-600'
                }`
              }
            >
              <div className="text-inherit">
                {/* Icono de edificio */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 3h18v18H3z" />
                  <path d="M9 3v18M15 3v18" />
                  <path d="M3 9h18M3 15h18" />
                </svg>
              </div>
              <span className="text-sm">Departamentos</span>
            </NavLink>

            {/* Inquilinos */}
            <NavLink
              to="/inquilinos"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-200 ${isActive ? 'bg-item-sidebar-active text-black' : 'hover:bg-gray-100 text-gray-600'
                }`
              }
            >
              <div className="text-inherit">
                {/* Icono de personas */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className="text-sm">Inquilinos</span>
            </NavLink>



            {/* Crear Contrato */}
            <NavLink
              to="/crearcontrato"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-200 ${isActive ? 'bg-item-sidebar-active text-black' : 'hover:bg-gray-100 text-gray-600'
                }`
              }
            >
              <div className="text-inherit">
                {/* Icono de documento con más */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M16 13v6M13 16h6" />
                </svg>
              </div>
              <span className="text-sm">Crear Contrato</span>
            </NavLink>

            {/* Lista de Contratos */}
            <NavLink
              to="/contratos"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-200 ${isActive ? 'bg-item-sidebar-active text-black' : 'hover:bg-gray-100 text-gray-600'
                }`
              }
            >
              <div className="text-inherit">
                {/* Icono de carpeta/documentos */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M3 7h18v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                  <path d="M16 3v4H8V3" />
                </svg>
              </div>
              <span className="text-sm">Contratos</span>
            </NavLink>




            {/* Agregar Pago */}
            <NavLink
              to="/agregarpago"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-200 ${isActive ? 'bg-item-sidebar-active text-black' : 'hover:bg-gray-100 text-gray-600'
                }`
              }
            >
              <div className="text-inherit">
                {/* Icono de billete con símbolo "+" */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24" viewBox="0 0 24 24">
                  <rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M16 8v4M14 10h4" />
                </svg>
              </div>
              <span className="text-sm">Agregar Pago</span>
            </NavLink>
            {user?.rol === "admin" && (<>
              {/* Lista de Pagos */}
              <NavLink
                to="/pagos"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-200 ${isActive ? 'bg-item-sidebar-active text-black' : 'hover:bg-gray-100 text-gray-600'
                  }`
                }
              >
                <div className="text-inherit">
                  {/* Icono de recibo/lista */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M4 4h16v16H4z" />
                    <path d="M4 10h16M4 14h16" />
                    <circle cx="8" cy="8" r="1" fill="currentColor" />
                    <circle cx="8" cy="12" r="1" fill="currentColor" />
                    <circle cx="8" cy="16" r="1" fill="currentColor" />
                  </svg>
                </div>
                <span className="text-sm">Lista de Pagos</span>
              </NavLink>
              {/* 
            * conifgurtacion
             */}
              <NavLink
                to="/config"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-200 ${isActive ? 'bg-item-sidebar-active text-black' : 'hover:bg-gray-100 text-gray-600'
                  }`
                }
              >
                <div className="text-inherit">
                  {/* Icono de billete con símbolo "+" */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 
           1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09
           a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06
           a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82
           1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09
           a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06
           a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9
           a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09
           a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06
           a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9
           c0 .69.28 1.35.77 1.82.49.47 1.13.74 1.82.74z" />
                  </svg>

                </div>
                <span className="text-sm">Conifguración</span>
              </NavLink>
            </>)}
            <button
              onClick={handleLogout}
              className="mt-auto flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 text-gray-600 w-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M17 16l4-4-4-4M21 12H9M13 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8" />
              </svg>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>

      </div>
    </div>



  );
}

export default Sidebar;
