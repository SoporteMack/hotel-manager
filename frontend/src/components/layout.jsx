// Layout.jsx
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import Sidebar from './sidebar';
import Header from './partials/header';
import UpdatePrompt from './UpdatePrompt';

function Layout() {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false); // estado de visibilidad
  return (
    <>
     <UpdatePrompt />  {/* Aquí el componente de aviso */}
    <div className="flex flex-col bg-gray-100 h-dvh overflow-hidden">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
  
      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
  
        <main className="flex-1 overflow-y-auto p-2">
          <Outlet />
        </main>
      </div>
    </div>
  </>
  
  );
}

export default Layout;
