import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para errores
api.interceptors.response.use(
  response => response,
  error => {
    const mensaje = error.response?.data?.error || 'Error en la petición';
    return Promise.reject(new Error(mensaje));
  }
);

export default api;