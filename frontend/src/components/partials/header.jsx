// header.jsx
function Header({ toggleSidebar }) {
  return (
    <header className="flex items-center justify-between border-b px-4 py-3 md:px-10 bg-primary-header">
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 text-primary">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <h2 className="text-lg font-bold text-text-secondary">InnControl</h2>
      </div>

      {/* Botón visible solo en móviles */}
      <button onClick={toggleSidebar} className="lg:hidden text-text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </header>
  );
}

export default Header;
