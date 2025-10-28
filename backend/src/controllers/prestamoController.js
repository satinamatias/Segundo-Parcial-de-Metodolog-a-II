const prestamoService = require('../services/prestamoService');
const { validarPrestamo, validarDevolucion } = require('../validators/prestamoValidator');

class PrestamoController {
  async crear(req, res, next) {
    try {
      const { error } = validarPrestamo(req.body);
      if (error) {
        return res.status(400).json({ 
          error: error.details.map(d => d.message).join(', ')
        });
      }

      const { socioId, isbn, fechaDevolucion } = req.body;
      
      const prestamo = await prestamoService.registrarPrestamo(
        socioId, 
        isbn, 
        fechaDevolucion
      );

      res.status(201).json({
        mensaje: 'Préstamo registrado exitosamente',
        prestamo
      });
    } catch (error) {
      next(error);
    }
  }

  async devolver(req, res, next) {
    try {
      const { id } = req.params;
      const { error } = validarDevolucion(req.body);
      
      if (error) {
        return res.status(400).json({ 
          error: error.details.map(d => d.message).join(', ')
        });
      }

      const { estadoFisico } = req.body;

      const resultado = await prestamoService.registrarDevolucion(
        parseInt(id),
        estadoFisico || 'BUENO'
      );

      res.json({
        mensaje: 'Devolución registrada exitosamente',
        ...resultado
      });
    } catch (error) {
      next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const { estado, socioId } = req.query;
      const filtros = {};
      
      if (estado) filtros.estado = estado;
      if (socioId) filtros.socioId = socioId;

      const prestamos = await prestamoService.obtenerTodos(filtros);
      res.json(prestamos);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;
      const prestamo = await prestamoService.obtenerPorId(parseInt(id));
      res.json(prestamo);
    } catch (error) {
      next(error);
    }
  }

  async obtenerVencidos(req, res, next) {
    try {
      const prestamos = await prestamoService.obtenerVencidos();
      res.json(prestamos);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PrestamoController();