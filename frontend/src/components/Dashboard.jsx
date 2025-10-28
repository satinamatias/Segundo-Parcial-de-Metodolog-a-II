import React, { useEffect, useState } from 'react';
import libroService from '../services/libroService';
import socioService from '../services/socioService';
import prestamoService from '../services/prestamoService';
import FormLibro from './libros/FormLibro';
import FormSocio from './socios/FormSocio';
import FormPrestamo from './prestamos/FormPrestamo';
import useLibroStore from '../store/useLibroStore';
import useSocioStore from '../store/useSocioStore';
import usePrestamoStore from '../store/usePrestamoStore';

const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalLibros: 0,
    librosDisponibles: 0,
    librosPrestados: 0,
    totalSocios: 0,
    prestamosActivos: 0,
    prestamosVencidos: 0
  });
  const [loading, setLoading] = useState(true);
  const [modalActivo, setModalActivo] = useState(null);

  const { agregarLibro } = useLibroStore();
  const { agregarSocio } = useSocioStore();
  const { registrarPrestamo } = usePrestamoStore();

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const [libros, socios, prestamos] = await Promise.all([
        libroService.obtenerTodos(),
        socioService.obtenerTodos(),
        prestamoService.obtenerTodos()
      ]);

      const librosDisponibles = libros.filter(l => l.estado === 'DISPONIBLE').length;
      const librosPrestados = libros.filter(l => l.estado === 'PRESTADO').length;
      const prestamosActivos = prestamos.filter(p => p.estado === 'ACTIVO').length;
      
      const hoy = new Date();
      const prestamosVencidos = prestamos.filter(p => 
        p.estado === 'ACTIVO' && new Date(p.fechaDevolucion) < hoy
      ).length;

      setStats({
        totalLibros: libros.length,
        librosDisponibles,
        librosPrestados,
        totalSocios: socios.length,
        prestamosActivos,
        prestamosVencidos
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarLibro = async (libro) => {
    await agregarLibro(libro);
    setModalActivo(null);
    cargarEstadisticas();
  };

  const handleAgregarSocio = async (socio) => {
    await agregarSocio(socio);
    setModalActivo(null);
    cargarEstadisticas();
  };

  const handleRegistrarPrestamo = async (prestamo) => {
    await registrarPrestamo(prestamo);
    setModalActivo(null);
    cargarEstadisticas();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const StatCard = ({ icon, title, value, subtitle, color = 'blue', onClick }) => (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-600 ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium uppercase">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
          {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
        </div>
        <div className={`text-5xl opacity-50`}>{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📊 Dashboard
        </h1>
        <p className="text-gray-600">
          Vista general del sistema de biblioteca
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon="📚"
          title="Total Libros"
          value={stats.totalLibros}
          subtitle={`${stats.librosDisponibles} disponibles`}
          color="blue"
          onClick={() => onNavigate && onNavigate('libros')}
        />
        
        <StatCard
          icon="👥"
          title="Total Socios"
          value={stats.totalSocios}
          subtitle="Socios registrados"
          color="green"
          onClick={() => onNavigate && onNavigate('socios')}
        />
        
        <StatCard
          icon="📋"
          title="Préstamos Activos"
          value={stats.prestamosActivos}
          subtitle={stats.prestamosVencidos > 0 ? `${stats.prestamosVencidos} vencidos` : 'Al día'}
          color={stats.prestamosVencidos > 0 ? 'red' : 'purple'}
          onClick={() => onNavigate && onNavigate('prestamos')}
        />
      </div>

      {/* Alertas */}
      {stats.prestamosVencidos > 0 && (
        <div 
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 cursor-pointer hover:bg-red-100 transition"
          onClick={() => onNavigate && onNavigate('prestamos')}
        >
          <div className="flex items-center">
            <div className="text-2xl mr-3">⚠️</div>
            <div>
              <p className="font-semibold text-red-800">
                Atención: {stats.prestamosVencidos} préstamo(s) vencido(s)
              </p>
              <p className="text-red-700 text-sm">
                Hay préstamos que superaron su fecha de devolución. Haz clic para ver detalles.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estado de libros */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📚 Estado de Libros
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Disponibles</span>
              <span className="font-semibold text-green-600">{stats.librosDisponibles}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Prestados</span>
              <span className="font-semibold text-yellow-600">{stats.librosPrestados}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">En reparación</span>
              <span className="font-semibold text-red-600">
                {stats.totalLibros - stats.librosDisponibles - stats.librosPrestados}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            ⚡ Acciones Rápidas
          </h3>
          <div className="space-y-2">
            <button 
              onClick={() => setModalActivo('prestamo')}
              className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded transition"
            >
              <span className="font-medium text-blue-800">→ Registrar nuevo préstamo</span>
            </button>
            <button 
              onClick={() => setModalActivo('libro')}
              className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded transition"
            >
              <span className="font-medium text-green-800">→ Agregar nuevo libro</span>
            </button>
            <button 
              onClick={() => setModalActivo('socio')}
              className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded transition"
            >
              <span className="font-medium text-purple-800">→ Registrar nuevo socio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      {modalActivo === 'libro' && (
        <FormLibro 
          onClose={() => setModalActivo(null)} 
          onSubmit={handleAgregarLibro}
        />
      )}

      {modalActivo === 'socio' && (
        <FormSocio 
          onClose={() => setModalActivo(null)} 
          onSubmit={handleAgregarSocio}
        />
      )}

      {modalActivo === 'prestamo' && (
        <FormPrestamo 
          onClose={() => setModalActivo(null)} 
          onSubmit={handleRegistrarPrestamo}
        />
      )}
    </div>
  );
};

export default Dashboard;