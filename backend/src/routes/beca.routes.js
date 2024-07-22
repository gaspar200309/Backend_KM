const express = require('express');
const router = express.Router();
const becaController = require('../controllers/becaController');

router.post('/', becaController.createBeca);
router.get('/', becaController.getBecas);
router.get('/:id', becaController.getBecaById);
router.put('/:id', becaController.updateBeca);
router.delete('/:id', becaController.deleteBeca);

module.exports = router;
