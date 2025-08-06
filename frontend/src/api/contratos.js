import axios from 'axios';

axios.defaults.withCredentials = true;

const API = axios.create({
  // baseURL: 'http://localhost:3000/api', // descomenta y cambia si usas IP externa o puerto diferente
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