import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; // o un spinner
  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
