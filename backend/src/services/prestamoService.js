const prestamoRepository = require('../repositories/prestamoRepository');
const libroRepository = require('../repositories/libroRepository');
const socioRepository = require('../repositories/socioRepository');
const multaRepository = require('../repositories/multaRepository');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PrestamoService {
  /**
   * Registra un nuevo préstamo
   */
  async registrarPrestamo(socioId, isbn, fechaDevolucion) {
    // 1. Validar socio existe
    const socio = await socioRepository.buscarPorId(socioId);
    if (!socio) {
      throw new Error('Socio no encontrado');
    }

    // 2. Buscar libro por ISBN
    const libro = await libroRepository.buscarPorISBN(isbn);
    if (!libro) {
      throw new Error(`Libro con ISBN ${isbn} no encontrado`);
    }

    // 3. Verificar disponibilidad
    if (libro.estado !== 'DISPONIBLE') {
      throw new Error('El libro no está disponible para préstamo');
    }

    // 4. Validar fecha de devolución
    const fechaDev = new Date(fechaDevolucion);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaDev <= hoy) {
      throw new Error('La fecha de devolución debe ser posterior a hoy');
    }

    // 5. Crear préstamo y actualizar estado del libro (transacción)
    const prestamo = await prisma.$transaction(async (tx) => {
      const nuevoPrestamo = await tx.prestamo.create({
        data: {
          socioId: socio.id,
          libroId: libro.id,
          fechaDevolucion: fechaDev,
          estado: 'ACTIVO'
        },
        include: {
          socio: true,
          libro: true
        }
      });

      await tx.libro.update({
        where: { id: libro.id },
        data: { estado: 'PRESTADO' }
      });

      return nuevoPrestamo;
    });

    return prestamo;
  }

  /**
   * Registra la devolución de un libro
   */
  async registrarDevolucion(prestamoId, estadoFisico = 'BUENO') {
    const prestamo = await prestamoRepository.buscarPorId(prestamoId);
    
    if (!prestamo) {
      throw new Error('Préstamo no encontrado');
    }

    if (prestamo.estado === 'DEVUELTO') {
      throw new Error('Este préstamo ya fue devuelto');
    }

    const fechaDevolucionReal = new Date();
    const multas = [];

    // Calcular multa por retraso
    if (fechaDevolucionReal > prestamo.fechaDevolucion) {
      const diasRetraso = Math.ceil(
        (fechaDevolucionReal - prestamo.fechaDevolucion) / (1000 * 60 * 60 * 24)
      );
      const montoMulta = diasRetraso * 50; // $50 por día

      multas.push({
        socioId: prestamo.socioId,
        monto: montoMulta,
        motivo: `Retraso de ${diasRetraso} día(s) en la devolución`
      });
    }

    // Multa por daño físico
    if (estadoFisico === 'DAÑADO') {
      multas.push({
        socioId: prestamo.socioId,
        monto: 500,
        motivo: 'Libro devuelto con daños'
      });
    }

    // Actualizar en transacción
    const resultado = await prisma.$transaction(async (tx) => {
      const prestamoActualizado = await tx.prestamo.update({
        where: { id: prestamoId },
        data: {
          fechaDevolucionReal,
          estado: 'DEVUELTO'
        },
        include: {
          socio: true,
          libro: true
        }
      });

      // CAMBIO AQUÍ: Siempre devolver como DISPONIBLE
      await tx.libro.update({
        where: { id: prestamo.libroId },
        data: { 
          estado: 'DISPONIBLE'  // ← Cambiado: Siempre disponible
        }
      });

      const multasCreadas = [];
      for (const multaData of multas) {
        const multa = await tx.multa.create({
          data: {
            ...multaData,
            prestamoId: prestamo.id
          }
        });
        multasCreadas.push(multa);
      }

      return { 
        prestamo: prestamoActualizado, 
        multas: multasCreadas 
      };
    });

    return resultado;
  }

  /**
   * Obtener todos los préstamos con filtros opcionales
   */
  async obtenerTodos(filtros = {}) {
    return await prestamoRepository.listarTodos(filtros);
  }

  /**
   * Obtener un préstamo por ID
   */
  async obtenerPorId(id) {
    const prestamo = await prestamoRepository.buscarPorId(id);
    if (!prestamo) {
      throw new Error('Préstamo no encontrado');
    }
    return prestamo;
  }

  /**
   * Obtener préstamos vencidos
   */
  async obtenerVencidos() {
    const prestamosVencidos = await prestamoRepository.obtenerPrestamosVencidos();
    
    // Actualizar estado a VENCIDO
    for (const prestamo of prestamosVencidos) {
      await prestamoRepository.actualizar(prestamo.id, { estado: 'VENCIDO' });
    }

    return prestamosVencidos;
  }
}

module.exports = new PrestamoService();