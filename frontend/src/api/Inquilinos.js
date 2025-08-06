import axios from "axios";
axios.defaults.withCredentials = true;
 const API = axios.create({
    //baseURL: 'http://192.168.3.239:3000/api',
    withCredentials: true
 });

 export const listaInquilinos = () => API.get('api/persona/listar');
 export const listaActivosInquilinos = ()=>API.get('api/persona/listaactivos');
 export const agregarInquilinos = (data)=> API.post('api/persona/crear',data);
 export const editarInquilinos = (idPersona,data)=>API.put('api/persona/actualizar/'+idPersona,data)


