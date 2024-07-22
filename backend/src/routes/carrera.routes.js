const express = require('express');
const router = express.Router();
const carreraController = require('../controllers/carreraController');

router.post('/carreras', carreraController.createCarrera);

router.get('/carreras', carreraController.getCarreras);

router.get('/carreras/:id', carreraController.getCarreraById);

router.put('/carreras/:id', carreraController.updateCarrera);

router.delete('/carreras/:id', carreraController.deleteCarrera);

module.exports = router;
