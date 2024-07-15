const OpenAI = require('openai');
require('dotenv').config();
const Chat = require('../models/chatModel'); // Importa el modelo

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function getChatResponse(userMessage) {
    try {
        const cachedResponse = await Chat.findOne({ question: userMessage });

        if (cachedResponse) {
            return cachedResponse.answer;
        }

        // Si no está en caché, solicitar a OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userMessage }],
        });

        const answer = completion.choices[0].message.content;

        // Guardar la nueva respuesta en la base de datos
        const newChat = new Chat({
            question: userMessage,
            answer: answer
        });
        await newChat.save();

        return answer;
    } catch (error) {
        console.error('Error in getChatResponse:', error);
        throw error;
    }
}

module.exports = { getChatResponse };
