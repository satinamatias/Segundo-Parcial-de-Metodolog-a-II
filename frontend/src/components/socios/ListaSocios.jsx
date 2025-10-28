import React, { useEffect, useState } from 'react';
import useSocioStore from '../../store/useSocioStore';
import SocioCard from './SocioCard';
import FormSocio from './FormSocio';

const ListaSocios = () => {
  const { socios, loading, error, fetchSocios, agregarSocio, eliminarSocio } = useSocioStore();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchSocios();
  }, [fetchSocios]);

  const sociosFiltrados = socios.filter(socio =>
    socio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    socio.dni.includes(busqueda)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">👥 Socios</h1>
          <p className="text-gray-600 mt-1">
            Total: {socios.length} socios registrados
          </p>
        </div>
        <button
          onClick={() => setMostrarForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          + Registrar Socio
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Modal de formulario */}
      {mostrarForm && (
        <FormSocio 
          onClose={() => setMostrarForm(false)} 
          onSubmit={agregarSocio}
        />
      )}

      {/* Grid de socios */}
      {sociosFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <p className="text-gray-500 text-lg">
            {busqueda 
              ? 'No se encontraron socios con ese criterio' 
              : 'No hay socios registrados. ¡Registra el primero!'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sociosFiltrados.map(socio => (
            <SocioCard 
              key={socio.id} 
              socio={socio} 
              onEliminar={eliminarSocio}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaSocios;