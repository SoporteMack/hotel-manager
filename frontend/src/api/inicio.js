import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
const API = axios.create({
  baseURL: apiUrl,
  withCredentials: true
});
 export const pagosdeldia = (fecha) =>  API.get('api/pagos/montosdeldia', {params: { fecha } });
 export const ocupacion = () => API.get('api/contratos/ocupacion');
 export const ultimospagos = () =>API.get('api/pagos/ultimospagos');
  

