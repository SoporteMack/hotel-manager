import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
const API = axios.create({
  baseURL: apiUrl,
  withCredentials: true
});

export const crear = (data)=>API.post('api/pension/pagos/crear',data);
export const listarxfecha = (inicio,fin) => API.get('api/pension/pagos/listarxfecha',{params:{inicio:inicio,fin:fin}});