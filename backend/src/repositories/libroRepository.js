const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class LibroRepository {
  async crear(datos) {
    return await prisma.libro.create({ 
      data: datos 
    });
  }

  async buscarPorISBN(isbn) {
    return await prisma.libro.findUnique({ 
      where: { isbn } 
    });
  }

  async buscarPorId(id) {
    return await prisma.libro.findUnique({ 
      where: { id },
      include: { 
        prestamos: {
          include: {
            socio: true
          }
        }
      }
    });
  }

  async listarTodos() {
    return await prisma.libro.findMany({
      orderBy: { titulo: 'asc' },
      include: {
        _count: {
          select: { prestamos: true }
        }
      }
    });
  }

  async actualizarEstado(id, estado) {
    return await prisma.libro.update({
      where: { id },
      data: { estado }
    });
  }

  async actualizar(id, datos) {
    return await prisma.libro.update({
      where: { id },
      data: datos
    });
  }

  async eliminar(id) {
    return await prisma.libro.delete({ 
      where: { id } 
    });
  }
}

module.exports = new LibroRepository();