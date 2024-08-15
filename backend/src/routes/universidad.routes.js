const express = require('express');
const router = express.Router();
const universidadController = require('../controllers/universidadController');

router.post('/', universidadController.createUniversidad);
router.put('/:id', universidadController.updateUniversidad);

router.get('/', universidadController.getUniversidades);
router.get('/:id', universidadController.getUniversidadById);
router.delete('/:id', universidadController.deleteUniversidad);

module.exports = router;
