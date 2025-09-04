import { Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext";

function RoleRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Cargando...</div>;
  if (!user) return <Navigate to="/login" />;

  // Si el rol no está en los permitidos
  if (!allowedRoles.includes(user.rol)) {
    return <Navigate to="/inicio" />; // o mostrar <h1>No autorizado 🚫</h1>
  }

  return children;
}

export default RoleRoute;
