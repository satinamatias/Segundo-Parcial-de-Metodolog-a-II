import api from './api';

const prestamoService = {
  obtenerTodos: async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.socioId) params.append('socioId', filtros.socioId);
    
    const { data } = await api.get(`/prestamos?${params.toString()}`);
    return data;
  },

  obtenerPorId: async (id) => {
    const { data } = await api.get(`/prestamos/${id}`);
    return data;
  },

  crear: async (prestamo) => {
    const { data } = await api.post('/prestamos', prestamo);
    return data;
  },

  devolver: async (id, estadoFisico) => {
    const { data } = await api.put(`/prestamos/${id}/devolver`, { estadoFisico });
    return data;
  },

  obtenerVencidos: async () => {
    const { data } = await api.get('/prestamos/vencidos');
    return data;
  }
};

export default prestamoService;