const Joi = require('joi');

const libroSchema = Joi.object({
  titulo: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'El título es requerido',
    'string.max': 'El título no puede exceder 255 caracteres'
  }),
  autor: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'El autor es requerido',
    'string.max': 'El autor no puede exceder 255 caracteres'
  }),
  isbn: Joi.string().length(13).pattern(/^[0-9]+$/).required().messages({
    'string.empty': 'El ISBN es requerido',
    'string.length': 'El ISBN debe tener exactamente 13 dígitos',
    'string.pattern.base': 'El ISBN solo puede contener números'
  })
});

const libroUpdateSchema = Joi.object({
  titulo: Joi.string().min(1).max(255).optional(),
  autor: Joi.string().min(1).max(255).optional(),
  isbn: Joi.string().length(13).pattern(/^[0-9]+$/).optional(),
  estado: Joi.string().valid('DISPONIBLE', 'PRESTADO', 'EN_REPARACION').optional()
}).min(1);

function validarLibro(data) {
  return libroSchema.validate(data, { abortEarly: false });
}

function validarActualizacionLibro(data) {
  return libroUpdateSchema.validate(data, { abortEarly: false });
}

module.exports = { 
  validarLibro, 
  validarActualizacionLibro 
};