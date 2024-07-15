const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    prompt: { type: String, required: true },
    response: { type: String, required: true }
});

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;
