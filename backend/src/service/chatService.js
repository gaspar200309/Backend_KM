const OpenAI = require('openai');
require('dotenv').config();
const Chat = require('../models/chatModel');
const Carrera = require('../models/Carrera');
const Beca = require('../models/Beca');
const Universidad = require('../models/Universidad');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function getChatResponse(userMessage) {
    try {
        const cachedResponse = await Chat.findOne({ question: userMessage });
        if (cachedResponse) {
            return cachedResponse.answer;
        }
        
        const universidad = await Universidad.findOne({ nombre: { $regex: userMessage, $options: 'i' } });
        if (universidad) {
            return `Aquí tienes información sobre la universidad: ${universidad.nombre}. Puedes visitarla en: ${universidad.enlace}`;
        }

        const carrera = await Carrera.findOne({ titulo: { $regex: userMessage, $options: 'i' } });
        if (carrera) {
            return `La carrera ${carrera.titulo} se ofrece en las siguientes universidades: ${carrera.universidades.map(u => u.nombre).join(', ')}`;
        }

        const beca = await Beca.findOne({ nombre: { $regex: userMessage, $options: 'i' } });
        if (beca) {
            return `La beca ${beca.nombre} es ofrecida por una institución ${beca.institucion} en ${beca.tipo}. Descripción: ${beca.descripcionUniversidad}`;
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userMessage }],
        });

        const answer = completion.choices[0].message.content;

        const newChat = new Chat({
            question: userMessage,
            answer: answer
        });
        await newChat.save();

        return answer;
    } catch (error) {
        console.error('Error en getChatResponse:', error);
        throw error;
    }
}

module.exports = { getChatResponse };
