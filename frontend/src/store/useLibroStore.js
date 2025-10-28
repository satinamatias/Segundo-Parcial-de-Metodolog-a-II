import { create } from 'zustand';
import libroService from '../services/libroService';

const useLibroStore = create((set, get) => ({
  libros: [],
  loading: false,
  error: null,

  fetchLibros: async () => {
    set({ loading: true, error: null });
    try {
      const libros = await libroService.obtenerTodos();
      set({ libros, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  agregarLibro: async (libro) => {
    try {
      await libroService.crear(libro);
      await get().fetchLibros(); // Recargar lista
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  eliminarLibro: async (id) => {
    try {
      await libroService.eliminar(id);
      await get().fetchLibros();
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  }
}));

export default useLibroStore;