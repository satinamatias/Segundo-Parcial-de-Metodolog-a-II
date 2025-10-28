const axios = require('axios');

const API_URL = 'http://localhost:3000/api/libros';

async function probarAPI() {
  try {
    console.log('🧪 Iniciando pruebas del API...\n');

    // 1. Crear libro
    console.log('1️⃣ Creando libro...');
    const crearResponse = await axios.post(API_URL, {
      titulo: 'El principito',
      autor: 'Antoine de Saint-Exupéry',
      isbn: '9780156012195'
    });
    console.log('✅ Libro creado:', crearResponse.data);
    const libroId = crearResponse.data.libro.id;
    console.log('');

    // 2. Listar libros
    console.log('2️⃣ Listando todos los libros...');
    const listarResponse = await axios.get(API_URL);
    console.log('✅ Total de libros:', listarResponse.data.length);
    console.log('Libros:', listarResponse.data.map(l => l.titulo));
    console.log('');

    // 3. Obtener por ID
    console.log('3️⃣ Obteniendo libro por ID...');
    const obtenerResponse = await axios.get(`${API_URL}/${libroId}`);
    console.log('✅ Libro obtenido:', obtenerResponse.data.titulo);
    console.log('');

    // 4. Actualizar libro
    console.log('4️⃣ Actualizando libro...');
    const actualizarResponse = await axios.put(`${API_URL}/${libroId}`, {
      titulo: 'El principito (Edición ilustrada)'
    });
    console.log('✅ Libro actualizado:', actualizarResponse.data.libro.titulo);
    console.log('');

    // 5. Intentar crear con ISBN duplicado
    console.log('5️⃣ Probando validación de ISBN duplicado...');
    try {
      await axios.post(API_URL, {
        titulo: 'Otro libro',
        autor: 'Otro autor',
        isbn: '9780156012195' // ISBN duplicado
      });
      console.log('❌ ERROR: Debería haber rechazado el ISBN duplicado');
    } catch (error) {
      console.log('✅ Validación correcta:', error.response.data.error);
    }
    console.log('');

    // 6. Eliminar libro
    console.log('6️⃣ Eliminando libro...');
    await axios.delete(`${API_URL}/${libroId}`);
    console.log('✅ Libro eliminado correctamente');
    console.log('');

    console.log('🎉 ¡Todas las pruebas pasaron exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

probarAPI();