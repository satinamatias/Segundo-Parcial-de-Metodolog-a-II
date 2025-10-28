import api from './api';

const libroService = {
  obtenerTodos: async () => {
    const { data } = await api.get('/libros');
    return data;
  },

  obtenerPorId: async (id) => {
    const { data } = await api.get(`/libros/${id}`);
    return data;
  },

  crear: async (libro) => {
    const { data } = await api.post('/libros', libro);
    return data;
  },

  actualizar: async (id, libro) => {
    const { data } = await api.put(`/libros/${id}`, libro);
    return data;
  },

  eliminar: async (id) => {
    await api.delete(`/libros/${id}`);
  }
};

export default libroService;