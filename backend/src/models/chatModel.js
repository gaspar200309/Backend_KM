const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '7d' } // Opcional: expira en 7 días
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
