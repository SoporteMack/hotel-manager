// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './components/inicio';
import Inquilinos from './components/inquilinos/inquilinos';
import Layout from './components/layout';
import { useAuth } from './context/authContext';
import Departamentos from './components/departamentos/departamentos';
import Contratos from './components/contratos/contratos';
import CrearContrato from './components/contratos/crearContrato';
import Pagos from './components/pagos/pagos';
import AgregarPagos from './components/pagos/agregarPago';
import EditarContratos from './components/contratos/editarContratos';
import Configuracion from './components/config/config';

// Ruta protegida
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Cargando...</div>;

  return user ? children : <Navigate to="/login" />;
}

// Ruta pública
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Cargando...</div>;

  return user ? <Navigate to="/inicio" /> : children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página de Login (sin Layout) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Rutas privadas con Layout (solo cambia el contenido central) */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          {/* Renderiza dentro de <Outlet /> de Layout */}

          <Route path="inicio" element={<Dashboard />} />
          <Route path="inquilinos" element={<Inquilinos />} />
          <Route path="departamentos" element={<Departamentos />} />
          <Route path="contratos" element={<Contratos />} />
          <Route path="crearcontrato" element={<CrearContrato />} />
          <Route path="pagos" element={<Pagos/>}/>
          <Route path='agregarpago' element={<AgregarPagos/>}></Route>
          <Route path='editarcontrato' element={<EditarContratos/>}></Route>
          <Route path='config' element={<Configuracion/>}></Route>

            {/* Agrega más rutas privadas aquí */}
        </Route>

        {/* 404 Redirecciona a login o inicio */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
