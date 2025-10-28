import React, { useState, useEffect } from 'react';
import socioService from '../../services/socioService';
import libroService from '../../services/libroService';

const FormPrestamo = ({ onClose, onSubmit }) => {
  const [socios, setSocios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [formData, setFormData] = useState({
    socioId: '',
    isbn: '',
    fechaDevolucion: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDatos();
    
    // Establecer fecha mínima (mañana)
    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);
    const fechaMin = mañana.toISOString().split('T')[0];
    
    // Establecer fecha por defecto (7 días desde hoy)
    const fechaDefault = new Date();
    fechaDefault.setDate(fechaDefault.getDate() + 7);
    const fechaDef = fechaDefault.toISOString().split('T')[0];
    
    setFormData(prev => ({ ...prev, fechaDevolucion: fechaDef }));
    document.getElementById('fechaDevolucion')?.setAttribute('min', fechaMin);
  }, []);

  const cargarDatos = async () => {
    try {
      const [sociosData, librosData] = await Promise.all([
        socioService.obtenerTodos(),
        libroService.obtenerTodos()
      ]);
      setSocios(sociosData);
      setLibros(librosData.filter(l => l.estado === 'DISPONIBLE'));
    } catch {
      setError('Error al cargar datos');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit({
        socioId: parseInt(formData.socioId),
        isbn: formData.isbn,
        fechaDevolucion: formData.fechaDevolucion
      });
      alert('Préstamo registrado exitosamente');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Registrar Préstamo</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {libros.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No hay libros disponibles para préstamo</p>
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition"
            >
              Cerrar
            </button>
          </div>
        ) : socios.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No hay socios registrados</p>
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Socio *
              </label>
              <select
                value={formData.socioId}
                onChange={(e) => setFormData({ ...formData, socioId: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar socio...</option>
                {socios.map(socio => (
                  <option key={socio.id} value={socio.id}>
                    {socio.nombre} - N° {socio.numeroSocio}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Libro *
              </label>
              <select
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar libro...</option>
                {libros.map(libro => (
                  <option key={libro.isbn} value={libro.isbn}>
                    {libro.titulo} - {libro.autor}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {libros.length} libro(s) disponible(s)
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Fecha de Devolución *
              </label>
              <input
                id="fechaDevolucion"
                type="date"
                value={formData.fechaDevolucion}
                onChange={(e) => setFormData({ ...formData, fechaDevolucion: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Se recomienda 7 días para préstamos regulares
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registrando...' : 'Registrar'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FormPrestamo;