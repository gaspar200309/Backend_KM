const express = require('express');
const router = express.Router();
const authRoutes = require('../routes/auth.routes');
const chatBotRoutes = require('../routes/chat.routes');
const carreraRoutes = require('../routes/carrera.routes')
const universidadRoutes = require('../routes/universidad.routes')
const becaRoutes = require('../routes/beca.routes')

router.use('/api/auth', authRoutes);
router.use('/api/chats', chatBotRoutes);
router.use('/api/carreras', carreraRoutes);
router.use('/api/universidades', universidadRoutes);
router.use('/api/becas', becaRoutes);

module.exports = router;
