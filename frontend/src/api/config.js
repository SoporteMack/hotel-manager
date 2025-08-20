import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
const API = axios.create({
 baseURL: apiUrl,
  withCredentials: true
});

export const config = () => API.get('api/config/listar');
export const actualizarConfiguracion = (config)=> API.post('api/config/actualizar',config);
