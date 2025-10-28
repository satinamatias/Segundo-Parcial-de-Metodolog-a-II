const libroRepository = require('../repositories/libroRepository');

class LibroService {
  async crearLibro(datos) {
    // Validar que no exista el ISBN
    const libroExistente = await libroRepository.buscarPorISBN(datos.isbn);
    if (libroExistente) {
      throw new Error('Ya existe un libro con ese ISBN');
    }

    return await libroRepository.crear(datos);
  }

  async obtenerTodos() {
    return await libroRepository.listarTodos();
  }

  async obtenerPorId(id) {
    const libro = await libroRepository.buscarPorId(id);
    if (!libro) {
      throw new Error('Libro no encontrado');
    }
    return libro;
  }

  async actualizarLibro(id, datos) {
    const libro = await libroRepository.buscarPorId(id);
    if (!libro) {
      throw new Error('Libro no encontrado');
    }

    // Si se está cambiando el ISBN, verificar que no exista
    if (datos.isbn && datos.isbn !== libro.isbn) {
      const libroConISBN = await libroRepository.buscarPorISBN(datos.isbn);
      if (libroConISBN) {
        throw new Error('Ya existe un libro con ese ISBN');
      }
    }

    return await libroRepository.actualizar(id, datos);
  }

  async eliminarLibro(id) {
    const libro = await libroRepository.buscarPorId(id);
    if (!libro) {
      throw new Error('Libro no encontrado');
    }

    // Verificar que no tenga préstamos activos
    const prestamosActivos = libro.prestamos?.filter(p => p.estado === 'ACTIVO');
    if (prestamosActivos && prestamosActivos.length > 0) {
      throw new Error('No se puede eliminar un libro con préstamos activos');
    }

    return await libroRepository.eliminar(id);
  }
}

module.exports = new LibroService();