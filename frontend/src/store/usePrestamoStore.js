import { create } from 'zustand';
import prestamoService from '../services/prestamoService';

const usePrestamoStore = create((set, get) => ({
  prestamos: [],
  loading: false,
  error: null,

  fetchPrestamos: async (filtros = {}) => {
    set({ loading: true, error: null });
    try {
      const prestamos = await prestamoService.obtenerTodos(filtros);
      set({ prestamos, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  registrarPrestamo: async (prestamo) => {
    try {
      await prestamoService.crear(prestamo);
      await get().fetchPrestamos();
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  devolverLibro: async (prestamoId, estadoFisico) => {
    try {
      await prestamoService.devolver(prestamoId, estadoFisico);
      await get().fetchPrestamos();
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  }
}));

export default usePrestamoStore;