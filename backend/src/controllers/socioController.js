const socioService = require('../services/socioService');
const { validarSocio, validarActualizacionSocio } = require('../validators/socioValidator');

class SocioController {
  async crear(req, res, next) {
    try {
      const { error } = validarSocio(req.body);
      if (error) {
        return res.status(400).json({ 
          error: error.details.map(d => d.message).join(', ')
        });
      }

      const socio = await socioService.registrarSocio(req.body);
      res.status(201).json({
        mensaje: 'Socio registrado exitosamente',
        socio
      });
    } catch (error) {
      next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const socios = await socioService.obtenerTodos();
      res.json(socios);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;
      const socio = await socioService.obtenerPorId(parseInt(id));
      res.json(socio);
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const { error } = validarActualizacionSocio(req.body);
      
      if (error) {
        return res.status(400).json({ 
          error: error.details.map(d => d.message).join(', ')
        });
      }

      const socio = await socioService.actualizarSocio(parseInt(id), req.body);
      res.json({
        mensaje: 'Socio actualizado exitosamente',
        socio
      });
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req, res, next) {
    try {
      const { id } = req.params;
      await socioService.eliminarSocio(parseInt(id));
      res.json({
        mensaje: 'Socio eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SocioController();