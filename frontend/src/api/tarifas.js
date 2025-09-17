import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
const API = axios.create({
  baseURL: apiUrl,
  withCredentials: true
});
export const tarifas = () => API.get('api/pension/tarifas/listar');
export const crear = (data) => API.post('api/pension/tarifas/crear',data);
export const actualizar = (id,data) => API.put('api/pension/tarifas/actualizar/'+id,data);
export const tarifaA = () => API.get('api/pension/tarifas/listaractivos');