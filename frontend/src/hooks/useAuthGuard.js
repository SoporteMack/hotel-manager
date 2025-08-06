import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validarToken } from '../api/auth';

const useAuthGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    validarToken()
      .then(res => {
        if (!res.data.autenticado) {
          navigate('/login');
        }
      })
      .catch(() => navigate('/login'));
  }, []);
};

export default useAuthGuard;
