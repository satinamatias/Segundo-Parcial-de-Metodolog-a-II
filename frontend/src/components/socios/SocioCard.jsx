import React from 'react';

const SocioCard = ({ socio, onEliminar }) => {
  const handleEliminar = async () => {
    if (window.confirm(`¿Estás seguro de eliminar al socio "${socio.nombre}"?`)) {
      try {
        await onEliminar(socio.id);
        alert('Socio eliminado exitosamente');
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 rounded-full p-3">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {socio.nombre}
            </h3>
            <p className="text-sm text-gray-500">
              N° {socio.numeroSocio}
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <p className="text-gray-600">
          <span className="font-medium">DNI:</span> {socio.dni}
        </p>
        
        {socio.email && (
          <p className="text-gray-600">
            <span className="font-medium">Email:</span> {socio.email}
          </p>
        )}
        
        {socio.telefono && (
          <p className="text-gray-600">
            <span className="font-medium">Teléfono:</span> {socio.telefono}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-gray-500">
          <span className="font-medium">{socio._count?.prestamos || 0}</span> préstamos
        </div>
        <button 
          onClick={handleEliminar}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition text-sm"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default SocioCard;