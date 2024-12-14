const express = require('express');
const router = express.Router();
const carreraController = require('../controllers/carreraController');

router.post('/carreras', carreraController.createCarrera);

router.get('/carreras', carreraController.getCarreras);

router.get('/carreras/:id', carreraController.getCarreraById);

router.put('/carreras/:id', carreraController.updateCarrera);

router.delete('/carreras/:id', carreraController.deleteCarrera);

router.get('/recomendadas', carreraController.getRecommendedCarreras);

router.get('/:id/recomendaciones', carreraController.getRecommendedCarrerasByArea);

router.get('/search', carreraController.buscarDatos);

module.exports = router;
