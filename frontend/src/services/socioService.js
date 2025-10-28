import api from './api';

const socioService = {
  obtenerTodos: async () => {
    const { data } = await api.get('/socios');
    return data;
  },

  obtenerPorId: async (id) => {
    const { data } = await api.get(`/socios/${id}`);
    return data;
  },

  crear: async (socio) => {
    const { data } = await api.post('/socios', socio);
    return data;
  },

  actualizar: async (id, socio) => {
    const { data } = await api.put(`/socios/${id}`, socio);
    return data;
  },

  eliminar: async (id) => {
    await api.delete(`/socios/${id}`);
  }
};

export default socioService;