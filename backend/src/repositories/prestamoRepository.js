const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PrestamoRepository {
  async crear(datos) {
    return await prisma.prestamo.create({ 
      data: datos,
      include: {
        socio: true,
        libro: true
      }
    });
  }

  async buscarPorId(id) {
    return await prisma.prestamo.findUnique({ 
      where: { id },
      include: {
        socio: true,
        libro: true,
        multas: true
      }
    });
  }

  async listarTodos(filtros = {}) {
    const where = {};
    
    if (filtros.estado) {
      where.estado = filtros.estado;
    }
    
    if (filtros.socioId) {
      where.socioId = parseInt(filtros.socioId);
    }

    return await prisma.prestamo.findMany({
      where,
      include: {
        socio: true,
        libro: true,
        multas: true
      },
      orderBy: {
        fechaInicio: 'desc'
      }
    });
  }

  async actualizar(id, datos) {
    return await prisma.prestamo.update({
      where: { id },
      data: datos,
      include: {
        socio: true,
        libro: true,
        multas: true
      }
    });
  }

  async obtenerPrestamosVencidos() {
    return await prisma.prestamo.findMany({
      where: {
        estado: 'ACTIVO',
        fechaDevolucion: {
          lt: new Date()
        }
      },
      include: {
        socio: true,
        libro: true
      }
    });
  }
}

module.exports = new PrestamoRepository();