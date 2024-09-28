const express = require('express');
const router = express.Router();
const authRoutes = require('../routes/auth.routes');
const chatBotRoutes = require('../routes/chat.routes');
const carreraRoutes = require('../routes/carrera.routes')
const universidadRoutes = require('../routes/universidad.routes')
const becaRoutes = require('../routes/beca.routes')
const comentarioRoutes = require('../routes/comentario.routes')
const contactoRoutes = require('../routes/contacto.routes')


router.use('/api/auth', authRoutes);
router.use('/api/chats', chatBotRoutes);
router.use('/api/carreras', carreraRoutes);
router.use('/api/universidades', universidadRoutes);
router.use('/api/becas', becaRoutes);
router.use('/api/comentarios', comentarioRoutes);
router.use('/api/contactos', contactoRoutes)

module.exports = router;
