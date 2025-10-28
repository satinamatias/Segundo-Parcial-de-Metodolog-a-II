const Joi = require('joi');

const socioSchema = Joi.object({
  nombre: Joi.string().min(3).max(255).required().messages({
    'string.empty': 'El nombre es requerido',
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede exceder 255 caracteres'
  }),
  dni: Joi.string().min(7).max(10).pattern(/^[0-9]+$/).required().messages({
    'string.empty': 'El DNI es requerido',
    'string.min': 'El DNI debe tener al menos 7 dígitos',
    'string.max': 'El DNI no puede exceder 10 dígitos',
    'string.pattern.base': 'El DNI solo puede contener números'
  }),
  email: Joi.string().email().optional().allow('').messages({
    'string.email': 'El email no es válido'
  }),
  telefono: Joi.string().optional().allow('')
});

const socioUpdateSchema = Joi.object({
  nombre: Joi.string().min(3).max(255).optional(),
  dni: Joi.string().min(7).max(10).pattern(/^[0-9]+$/).optional(),
  email: Joi.string().email().optional().allow(''),
  telefono: Joi.string().optional().allow('')
}).min(1);

function validarSocio(data) {
  return socioSchema.validate(data, { abortEarly: false });
}

function validarActualizacionSocio(data) {
  return socioUpdateSchema.validate(data, { abortEarly: false });
}

module.exports = { 
  validarSocio, 
  validarActualizacionSocio 
};