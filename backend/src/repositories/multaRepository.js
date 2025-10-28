const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class MultaRepository {
  async crear(datos) {
    return await prisma.multa.create({ 
      data: datos 
    });
  }

  async buscarPorId(id) {
    return await prisma.multa.findUnique({ 
      where: { id } 
    });
  }

  async listarPorSocio(socioId) {
    return await prisma.multa.findMany({
      where: { 
        socioId,
        pagada: false 
      },
      include: {
        prestamo: {
          include: {
            libro: true
          }
        }
      }
    });
  }

  async marcarComoPagada(id) {
    return await prisma.multa.update({
      where: { id },
      data: { 
        pagada: true,
        fechaPago: new Date()
      }
    });
  }
}

module.exports = new MultaRepository();