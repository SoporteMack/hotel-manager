import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, validarToken } from '../api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Al iniciar la app, validar si hay sesión activa
  useEffect(() => {
    validarToken()
      .then(res => {
        if (res.data.autenticado) {
          setUser({}); // O setUser con datos del usuario si los tienes
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  const login = async (credenciales) => {
    const res = await apiLogin(credenciales);
    if (res.data.status) {
      setUser({}); // O con datos reales
      return true;
    } else {
      throw new Error(res.data.msg);
    }
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
