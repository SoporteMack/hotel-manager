import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
const API = axios.create({
  baseURL: apiUrl,
  withCredentials: true
});
 export const pagosdeldia = (fechaInicio,fechaFinal) =>  API.get('api/pagos/montosdeldia', {params: { fechaInicio,fechaFinal } });
 export const ocupacion = () => API.get('api/contratos/ocupacion');
 export const ultimospagos = () =>API.get('api/pagos/ultimospagos');
 export const obtenerrentasvencidas = () => API.get('api/contratos/rentasvencidas');
 export const obtenerundia = (fecha) => API.get('api/contratos/undia',{params:{fecha}});
  

