const Joi = require('joi');

const prestamoSchema = Joi.object({
  socioId: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID del socio debe ser un número',
    'number.positive': 'El ID del socio debe ser positivo',
    'any.required': 'El socio es requerido'
  }),
  isbn: Joi.string().length(13).pattern(/^[0-9]+$/).required().messages({
    'string.empty': 'El ISBN es requerido',
    'string.length': 'El ISBN debe tener exactamente 13 dígitos',
    'string.pattern.base': 'El ISBN solo puede contener números'
  }),
  fechaDevolucion: Joi.date().greater('now').required().messages({
    'date.base': 'La fecha de devolución no es válida',
    'date.greater': 'La fecha de devolución debe ser posterior a hoy',
    'any.required': 'La fecha de devolución es requerida'
  })
});

const devolucionSchema = Joi.object({
  estadoFisico: Joi.string().valid('BUENO', 'DAÑADO').default('BUENO').messages({
    'any.only': 'El estado físico debe ser BUENO o DAÑADO'
  })
});

function validarPrestamo(data) {
  return prestamoSchema.validate(data, { abortEarly: false });
}

function validarDevolucion(data) {
  return devolucionSchema.validate(data, { abortEarly: false });
}

module.exports = { 
  validarPrestamo,
  validarDevolucion
};