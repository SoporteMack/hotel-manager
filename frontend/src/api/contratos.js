import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
const API = axios.create({
  baseURL: apiUrl,
  withCredentials: true
});

// Crear contrato con FormData (para subir archivos)
export const crearContrato = (formData) =>
  API.post('api/contratos/crear', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

// Puedes agregar más funciones si necesitas
export const listarContratos = () => API.get('api/contratos/listar');
export const eliminarContrato = (idContrato) => API.delete(`api/contratos/${idContrato}`);
export const listacontratosxpersona = (nombre,apellidoP,apellidoM) =>API.get('api/contratos/contratoxpersona',{params: { nombre,apellidoP,apellidoM } })