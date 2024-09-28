const mongoose = require('mongoose');

const ComentarioSchema = new mongoose.Schema({
    idContacto: {type: String, required: true, unique: true},
    comentario: { type: String, required: true },
    
});

module.exports = mongoose.model('Comentario', ComentarioSchema);
