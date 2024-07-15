const express = require('express');
const router = express.Router();
const authRoutes = require('../routes/auth.routes');
const chatBotRoutes = require('../routes/chat.routes');

router.use('/api/auth', authRoutes);
router.use('/api/chats', chatBotRoutes);

module.exports = router;
