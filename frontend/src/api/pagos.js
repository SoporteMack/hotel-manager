import axios from "axios";
axios.defaults.withCredentials = true;
 const API = axios.create({
    baseURL: 'http://192.168.3.239:3000/api',
    withCredentials: true
 });
 export const pagosxfecha = (inicio,fin) =>  API.get('api/pagos/pagosxfecha', {params: { inicio,fin } });
 export const pago = (data) => API.post('api/pagos/crear',data);
 export const editarpago = (data) =>API.post('api/pagos/editar',data);
  

