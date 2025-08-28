import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
const API = axios.create({
  baseURL: apiUrl,
  withCredentials: true
});
 export const departamentos = () =>  API.get('api/departamentos/listar');
 export const departamentosactivos = ()=> API.get('api/departamentos/listardepartamentosactivo');
 export const departamentosactivosyactual = (actual)=>API.get('api/departamentos/listardepartamentosactivoyactual',{params:{numDepartamento:actual}});
 export const agregarDepartamento = (data) =>  API.post('api/departamentos/crear',data);
 export const actualizarDepartamento = (id,data) =>  API.put('api/departamentos/actualizar/'+id,data);
