import { create } from 'zustand';
import socioService from '../services/socioService';

const useSocioStore = create((set, get) => ({
  socios: [],
  loading: false,
  error: null,

  fetchSocios: async () => {
    set({ loading: true, error: null });
    try {
      const socios = await socioService.obtenerTodos();
      set({ socios, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  agregarSocio: async (socio) => {
    try {
      await socioService.crear(socio);
      await get().fetchSocios();
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  eliminarSocio: async (id) => {
    try {
      await socioService.eliminar(id);
      await get().fetchSocios();
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  }
}));

export default useSocioStore;