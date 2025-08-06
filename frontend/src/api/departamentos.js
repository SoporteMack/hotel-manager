import axios from "axios";
axios.defaults.withCredentials = true;
 const API = axios.create({
    //baseURL: 'http://192.168.3.239:3000/api',
    withCredentials: true
 });
 export const departamentos = () =>  API.get('api/departamentos/listar');
 export const departamentosactivos = ()=> API.get('api/departamentos/listardepartamentosactivo');
 export const agregarDepartamento = (data) =>  API.post('api/departamentos/crear',data);
 export const actualizarDepartamento = (id,data) =>  API.put('api/departamentos/actualizar/'+id,data);
