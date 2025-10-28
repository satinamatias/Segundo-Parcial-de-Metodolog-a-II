const socioRepository = require('../repositories/socioRepository');

class SocioService {
  async registrarSocio(datos) {
    // Validar que no exista el DNI
    const socioExistente = await socioRepository.buscarPorDNI(datos.dni);
    if (socioExistente) {
      throw new Error('Ya existe un socio con ese DNI');
    }

    return await socioRepository.crear(datos);
  }

  async obtenerTodos() {
    return await socioRepository.listarTodos();
  }

  async obtenerPorId(id) {
    const socio = await socioRepository.buscarPorId(id);
    if (!socio) {
      throw new Error('Socio no encontrado');
    }
    return socio;
  }

  async actualizarSocio(id, datos) {
    const socio = await socioRepository.buscarPorId(id);
    if (!socio) {
      throw new Error('Socio no encontrado');
    }

    // Si se está cambiando el DNI, verificar que no exista
    if (datos.dni && datos.dni !== socio.dni) {
      const socioConDNI = await socioRepository.buscarPorDNI(datos.dni);
      if (socioConDNI) {
        throw new Error('Ya existe un socio con ese DNI');
      }
    }

    return await socioRepository.actualizar(id, datos);
  }

  async eliminarSocio(id) {
    const socio = await socioRepository.buscarPorId(id);
    if (!socio) {
      throw new Error('Socio no encontrado');
    }

    // Verificar que no tenga préstamos activos
    if (socio.prestamos && socio.prestamos.length > 0) {
      throw new Error('No se puede eliminar un socio con préstamos activos');
    }

    // Verificar que no tenga multas sin pagar
    if (socio.multas && socio.multas.length > 0) {
      throw new Error('No se puede eliminar un socio con multas pendientes');
    }

    return await socioRepository.eliminar(id);
  }
}

module.exports = new SocioService();