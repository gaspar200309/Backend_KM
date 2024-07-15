const { getChatResponse } = require('../service/chatService');

async function chat(req, res) {
    try {
        const userMessage = req.body.message;
        console.log(userMessage)
        const response = await getChatResponse(userMessage);
        res.status(200).json({ response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error generating response' });
    }
}

module.exports = { chat };
