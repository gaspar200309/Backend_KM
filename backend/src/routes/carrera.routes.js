const express = require('express');
const router = express.Router();
const carreraController = require('../controllers/carreraController');

router.post('/carreras', carreraController.createCarrera);

router.get('/1', carreraController.getCarreras1);

router.get('/carreras', carreraController.getCarreras);

router.get('/carreras/:id', carreraController.getCarreraById);

router.put('/carreras/:id', carreraController.updateCarrera);

router.delete('/carreras/:id', carreraController.deleteCarrera);

router.get('/recomendadas', carreraController.getRecommendedCarreras);

router.get('/:id/recomendaciones', carreraController.getRecommendedCarrerasByArea);


module.exports = router;
