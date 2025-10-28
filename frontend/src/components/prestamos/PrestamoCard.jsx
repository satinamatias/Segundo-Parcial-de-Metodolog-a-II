import React, { useState } from 'react';

const PrestamoCard = ({ prestamo, onDevolver }) => {
  const [mostrarDevolucion, setMostrarDevolucion] = useState(false);
  const [estadoFisico, setEstadoFisico] = useState('BUENO');
  const [loading, setLoading] = useState(false);

  const estadoColor = {
    ACTIVO: 'bg-blue-100 text-blue-800',
    DEVUELTO: 'bg-green-100 text-green-800',
    VENCIDO: 'bg-red-100 text-red-800'
  };

  const calcularDiasRestantes = () => {
    const hoy = new Date();
    const fechaDev = new Date(prestamo.fechaDevolucion);
    const diff = Math.ceil((fechaDev - hoy) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const diasRestantes = calcularDiasRestantes();

  const handleDevolver = async () => {
    if (window.confirm('¿Confirmar la devolución de este libro?')) {
      setLoading(true);
      try {
        await onDevolver(prestamo.id, estadoFisico);
        alert('Devolución registrada exitosamente');
        setMostrarDevolucion(false);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            📚 {prestamo.libro.titulo}
          </h3>
          <p className="text-sm text-gray-500">{prestamo.libro.autor}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoColor[prestamo.estado]}`}>
          {prestamo.estado}
        </span>
      </div>

      {/* Info del Socio */}
      <div className="mb-4 pb-4 border-b">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Socio:</span> {prestamo.socio.nombre}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">N° Socio:</span> {prestamo.socio.numeroSocio}
        </p>
      </div>

      {/* Fechas */}
      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Fecha préstamo:</span> {formatearFecha(prestamo.fechaInicio)}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Fecha devolución:</span> {formatearFecha(prestamo.fechaDevolucion)}
        </p>
        
        {prestamo.fechaDevolucionReal && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Devuelto el:</span> {formatearFecha(prestamo.fechaDevolucionReal)}
          </p>
        )}

        {/* Indicador de días restantes */}
        {prestamo.estado === 'ACTIVO' && (
          <div className={`text-sm font-medium ${diasRestantes < 0 ? 'text-red-600' : diasRestantes <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
            {diasRestantes < 0 
              ? `⚠️ Vencido hace ${Math.abs(diasRestantes)} día(s)`
              : diasRestantes === 0
              ? '⚠️ Vence hoy'
              : `✓ ${diasRestantes} día(s) restantes`
            }
          </div>
        )}
      </div>

      {/* Multas */}
      {prestamo.multas && prestamo.multas.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
          <p className="text-sm font-medium text-red-800 mb-2">Multas:</p>
          {prestamo.multas.map((multa, index) => (
            <div key={index} className="text-sm text-red-700">
              • ${multa.monto} - {multa.motivo}
            </div>
          ))}
        </div>
      )}

      {/* Botón de Devolución */}
      {prestamo.estado === 'ACTIVO' && !mostrarDevolucion && (
        <button
          onClick={() => setMostrarDevolucion(true)}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Registrar Devolución
        </button>
      )}

      {/* Formulario de Devolución */}
      {mostrarDevolucion && (
        <div className="border-t pt-4 mt-4">
          <p className="font-medium text-gray-700 mb-3">Estado del libro:</p>
          <div className="space-y-2 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="estadoFisico"
                value="BUENO"
                checked={estadoFisico === 'BUENO'}
                onChange={(e) => setEstadoFisico(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm">✓ Buenas condiciones</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="estadoFisico"
                value="DAÑADO"
                checked={estadoFisico === 'DAÑADO'}
                onChange={(e) => setEstadoFisico(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm">⚠️ Dañado (se aplicará multa de $500)</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDevolver}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? 'Procesando...' : 'Confirmar'}
            </button>
            <button
              onClick={() => setMostrarDevolucion(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrestamoCard;