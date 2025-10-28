const libroService = require('../services/libroService');
const { validarLibro, validarActualizacionLibro } = require('../validators/libroValidator');

class LibroController {
  async crear(req, res, next) {
    try {
      const { error } = validarLibro(req.body);
      if (error) {
        return res.status(400).json({ 
          error: error.details.map(d => d.message).join(', ')
        });
      }

      const libro = await libroService.crearLibro(req.body);
      res.status(201).json({
        mensaje: 'Libro creado exitosamente',
        libro
      });
    } catch (error) {
      next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const libros = await libroService.obtenerTodos();
      res.json(libros);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;
      const libro = await libroService.obtenerPorId(parseInt(id));
      res.json(libro);
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const { error } = validarActualizacionLibro(req.body);
      
      if (error) {
        return res.status(400).json({ 
          error: error.details.map(d => d.message).join(', ')
        });
      }

      const libro = await libroService.actualizarLibro(parseInt(id), req.body);
      res.json({
        mensaje: 'Libro actualizado exitosamente',
        libro
      });
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req, res, next) {
    try {
      const { id } = req.params;
      await libroService.eliminarLibro(parseInt(id));
      res.json({
        mensaje: 'Libro eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LibroController();