import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
const API = axios.create({
  baseURL: apiUrl,
  withCredentials: true
});
 export const pagosxfecha = (inicio,fin) =>  API.get('api/pagos/pagosxfecha', {params: { inicio,fin } });
 export const pago = (data) => API.post('api/pagos/crear',data);
 export const editarpago = (data) =>API.post('api/pagos/editar',data);
 export const ulitmoCobro = (idContrato) =>API.post('api/cobrosr/ultimoCobroContrato',{idContrato});
 export const reporteEstadoPagos = () => API.get('api/pagos/reporteestadopagos');
  

