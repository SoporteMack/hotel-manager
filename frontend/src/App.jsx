import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./components/inicio";
import Inquilinos from "./components/inquilinos/inquilinos";
import Layout from "./components/layout";
import { useAuth } from "./context/authContext";
import Departamentos from "./components/departamentos/departamentos";
import Contratos from "./components/contratos/contratos";
import CrearContrato from "./components/contratos/crearContrato";
import Pagos from "./components/pagos/pagos";
import AgregarPagos from "./components/pagos/agregarPago";
import EditarContratos from "./components/contratos/editarContratos";
import Configuracion from "./components/config/config";
import RoleRoute from "./RoleRoute";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Cargando...</div>;
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Cargando...</div>;
  return user ? <Navigate to="/inicio" /> : children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Rutas privadas */}
        <Route path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          {/* Acceso para todos los usuarios logueados */}
          <Route path="inicio" element={<Dashboard />} />

          {/* Solo admin */}
          <Route path="inquilinos" element={<RoleRoute allowedRoles={["admin", "ayudante"]}> <Inquilinos /></RoleRoute>} />
          <Route path="departamentos" element={<RoleRoute allowedRoles={["admin"]}><Departamentos /></RoleRoute>} />
          <Route path="contratos" element={<RoleRoute allowedRoles={["admin", "ayudante"]}><Contratos /></RoleRoute>} />
          <Route path="crearcontrato" element={<RoleRoute allowedRoles={["admin", "ayudante"]}><CrearContrato /></RoleRoute>} />
          <Route path="editarcontrato" element={<RoleRoute allowedRoles={["admin"]}> <EditarContratos /></RoleRoute>} />
          <Route path="config" element={<RoleRoute allowedRoles={["admin"]}><Configuracion /></RoleRoute>} />

          {/* Admin e inquilino */}
          <Route path="pagos" element={<RoleRoute allowedRoles={["admin"]}><Pagos /></RoleRoute>} />
          <Route path="agregarpago" element={<RoleRoute allowedRoles={["admin", "ayudante"]}><AgregarPagos /></RoleRoute>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
