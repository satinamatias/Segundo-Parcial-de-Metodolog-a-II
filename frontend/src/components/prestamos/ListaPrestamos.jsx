import React, { useEffect, useState } from 'react';
import usePrestamoStore from '../../store/usePrestamoStore';
import PrestamoCard from './PrestamoCard';
import FormPrestamo from './FormPrestamo';

const ListaPrestamos = () => {
  const { prestamos, loading, error, fetchPrestamos, registrarPrestamo, devolverLibro } = usePrestamoStore();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [filtro, setFiltro] = useState('TODOS');

  useEffect(() => {
    const filtros = filtro === 'TODOS' ? {} : { estado: filtro };
    fetchPrestamos(filtros);
  }, [filtro, fetchPrestamos]);

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
          <h1 className="text-3xl font-bold text-gray-800">📋 Préstamos</h1>
          <p className="text-gray-600 mt-1">
            Total: {prestamos.length} préstamos
          </p>
        </div>
        <button
          onClick={() => setMostrarForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          + Nuevo Préstamo
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['TODOS', 'ACTIVO', 'DEVUELTO', 'VENCIDO'].map(estado => (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className={`px-4 py-2 rounded-lg transition ${
              filtro === estado
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {estado === 'TODOS' ? 'Todos' : estado}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Modal de formulario */}
      {mostrarForm && (
        <FormPrestamo 
          onClose={() => setMostrarForm(false)} 
          onSubmit={registrarPrestamo}
        />
      )}

      {/* Grid de préstamos */}
      {prestamos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <p className="text-gray-500 text-lg">
            {filtro === 'TODOS' 
              ? 'No hay préstamos registrados. ¡Registra el primero!' 
              : `No hay préstamos con estado: ${filtro}`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prestamos.map(prestamo => (
            <PrestamoCard 
              key={prestamo.id} 
              prestamo={prestamo} 
              onDevolver={devolverLibro}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaPrestamos;