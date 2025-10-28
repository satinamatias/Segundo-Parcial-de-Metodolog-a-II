const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libroController');

router.post('/', libroController.crear);
router.get('/', libroController.listar);
router.get('/:id', libroController.obtenerPorId);
router.put('/:id', libroController.actualizar);
router.delete('/:id', libroController.eliminar);

module.exports = router;