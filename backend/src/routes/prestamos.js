const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamoController');

router.post('/', prestamoController.crear);
router.put('/:id/devolver', prestamoController.devolver);
router.get('/', prestamoController.listar);
router.get('/vencidos', prestamoController.obtenerVencidos);
router.get('/:id', prestamoController.obtenerPorId);

module.exports = router;