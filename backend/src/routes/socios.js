const express = require('express');
const router = express.Router();
const socioController = require('../controllers/socioController');

router.post('/', socioController.crear);
router.get('/', socioController.listar);
router.get('/:id', socioController.obtenerPorId);
router.put('/:id', socioController.actualizar);
router.delete('/:id', socioController.eliminar);

module.exports = router;