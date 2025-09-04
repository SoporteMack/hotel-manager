import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
const API = axios.create({
 baseURL: apiUrl,
  withCredentials: true
});
console.log(apiUrl)
export const login = (credenciales) => API.post('api/auth/login', credenciales);
export const logout = () => API.post('api/auth/logout');
export const validarToken = () => API.get('api/auth/validar')
