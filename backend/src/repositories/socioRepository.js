const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class SocioRepository {
  async crear(datos) {
    return await prisma.socio.create({ 
      data: datos 
    });
  }

  async buscarPorDNI(dni) {
    return await prisma.socio.findUnique({ 
      where: { dni } 
    });
  }

  async buscarPorId(id) {
    return await prisma.socio.findUnique({ 
      where: { id },
      include: { 
        prestamos: {
          where: { estado: 'ACTIVO' },
          include: {
            libro: true
          }
        },
        multas: {
          where: { pagada: false }
        }
      }
    });
  }

  async listarTodos() {
    return await prisma.socio.findMany({
      orderBy: { nombre: 'asc' },
      include: {
        _count: {
          select: { 
            prestamos: true,
            multas: true
          }
        }
      }
    });
  }

  async actualizar(id, datos) {
    return await prisma.socio.update({
      where: { id },
      data: datos
    });
  }

  async eliminar(id) {
    return await prisma.socio.delete({ 
      where: { id } 
    });
  }
}

module.exports = new SocioRepository();