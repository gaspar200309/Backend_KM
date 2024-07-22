const express = require('express');
const router = express.Router();
const universidadController = require('../controllers/universidadController');

router.post('/', universidadController.createUniversidad);
router.get('/', universidadController.getUniversidades);
router.get('/:id', universidadController.getUniversidadById);
router.put('/:id', universidadController.updateUniversidad);
router.delete('/:id', universidadController.deleteUniversidad);

module.exports = router;
