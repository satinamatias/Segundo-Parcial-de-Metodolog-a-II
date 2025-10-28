import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ListaLibros from './components/libros/ListaLibros';
import ListaSocios from './components/socios/ListaSocios';
import ListaPrestamos from './components/prestamos/ListaPrestamos';

function App() {
  const [vistaActual, setVistaActual] = useState('dashboard');

  const handleNavigate = (vista) => {
    setVistaActual(vista);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setVistaActual('dashboard')}
            >
              <span className="text-3xl">📚</span>
              <h1 className="text-2xl font-bold text-blue-600">
                Sistema de Biblioteca
              </h1>
            </div>
            <div className="flex gap-6">
              <button
                onClick={() => setVistaActual('dashboard')}
                className={`font-medium transition pb-1 ${
                  vistaActual === 'dashboard'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setVistaActual('libros')}
                className={`font-medium transition pb-1 ${
                  vistaActual === 'libros'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Libros
              </button>
              <button
                onClick={() => setVistaActual('socios')}
                className={`font-medium transition pb-1 ${
                  vistaActual === 'socios'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Socios
              </button>
              <button
                onClick={() => setVistaActual('prestamos')}
                className={`font-medium transition pb-1 ${
                  vistaActual === 'prestamos'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Préstamos
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      {vistaActual === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
      {vistaActual === 'libros' && <ListaLibros />}
      {vistaActual === 'socios' && <ListaSocios />}
      {vistaActual === 'prestamos' && <ListaPrestamos />}
    </div>
  );
}

export default App;