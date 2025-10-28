import React, { useEffect, useState } from 'react';
import useLibroStore from '../../store/useLibroStore';
import LibroCard from './LibroCard';
import FormLibro from './FormLibro';

const ListaLibros = () => {
  const { libros, loading, error, fetchLibros, agregarLibro, eliminarLibro } = useLibroStore();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [filtro, setFiltro] = useState('TODOS');

  useEffect(() => {
    fetchLibros();
  }, [fetchLibros]);

  const librosFiltrados = filtro === 'TODOS' 
    ? libros 
    : libros.filter(libro => libro.estado === filtro);

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
          <h1 className="text-3xl font-bold text-gray-800">📚 Libros</h1>
          <p className="text-gray-600 mt-1">
            Total: {libros.length} libros
          </p>
        </div>
        <button
          onClick={() => setMostrarForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          + Agregar Libro
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {['TODOS', 'DISPONIBLE', 'PRESTADO'].map(estado => (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className={`px-4 py-2 rounded-lg transition ${
              filtro === estado
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {estado === 'TODOS' ? 'Todos' : estado.replace('_', ' ')}
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
        <FormLibro 
          onClose={() => setMostrarForm(false)} 
          onSubmit={agregarLibro}
        />
      )}

      {/* Grid de libros */}
      {librosFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <p className="text-gray-500 text-lg">
            {filtro === 'TODOS' 
              ? 'No hay libros registrados. ¡Agrega el primero!' 
              : `No hay libros con estado: ${filtro}`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {librosFiltrados.map(libro => (
            <LibroCard 
              key={libro.id} 
              libro={libro} 
              onEliminar={eliminarLibro}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaLibros;