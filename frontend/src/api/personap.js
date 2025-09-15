import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
const API = axios.create({
    baseURL: apiUrl,
    withCredentials: true
});

// Crear contrato con FormData (para subir archivos)
export const agregarPersonaPension = (formData) =>
    API.post('api/pension/personas/crear', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
export const listaPersonasPension = () => API.get('api/pension/personas/listar');
export const editarPersonaPension = (data) => API.post('api/pension/personas/actualizar', data);
export const agregarcom = (formData) =>
    API.post('api/pension/personas/actualizarcom', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

export const agregarine = (formData) =>
    API.post('api/pension/personas/actualizarine', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
