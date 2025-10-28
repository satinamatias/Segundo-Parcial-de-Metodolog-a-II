import React from 'react';

const LibroCard = ({ libro, onEliminar }) => {
  const estadoColor = {
    DISPONIBLE: 'bg-green-100 text-green-800',
    PRESTADO: 'bg-yellow-100 text-yellow-800'
  };

  const handleEliminar = async () => {
    if (window.confirm(`¿Estás seguro de eliminar "${libro.titulo}"?`)) {
      try {
        await onEliminar(libro.id);
        alert('Libro eliminado exitosamente');
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex-1">
          {libro.titulo}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoColor[libro.estado]}`}>
          {libro.estado}
        </span>
      </div>
      
      <p className="text-gray-600 mb-2">
        <span className="font-medium">Autor:</span> {libro.autor}
      </p>
      
      <p className="text-gray-600 mb-4">
        <span className="font-medium">ISBN:</span> {libro.isbn}
      </p>

      <div className="flex gap-2">
        {libro.estado === 'DISPONIBLE' && (
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
            Prestar
          </button>
        )}
        <button 
          onClick={handleEliminar}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default LibroCard;