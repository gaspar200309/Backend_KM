const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');

router.post('/comentario', comentarioController.createComentario);


module.exports = router;
