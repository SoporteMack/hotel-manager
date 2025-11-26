import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
const API = axios.create({
  baseURL: apiUrl,
  withCredentials: true
});
export const pensiones = ()=>API.get('api/pension/listar')
export const crearPension = (data)=> API.post('api/pension/crear',data);
export const actualizarPension = (data) =>API.post('api/pension/actualizar',data);
export const tienecom = (idPersona)=>API.get('api/pension/personas/com',{params:{idPersona:idPersona}});
export const nombre = (idPersona)=>API.get('api/pension/personas/nombre',{params:{idPersona:idPersona}});
export const  pagoxcobro = (data) => API.post('api/pension/cobros/cobrosxpago',data);