import axios from 'axios';
axios.defaults.withCredentials = true;
const API = axios.create({
  //baseURL: 'http://192.168.3.239:3000/api',
  withCredentials: true
});

export const login = (credenciales) => API.post('api/auth/login', credenciales);
export const logout = () => API.post('api/logout');
export const validarToken = () => API.get('api/auth/validar');
