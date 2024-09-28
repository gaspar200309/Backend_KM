const mongoose = require('mongoose');

const ContactoSchema = new mongoose.Schema({
    idContacto: {type: String, required: true, unique: true},
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String, required: true },
    Mensaje: { type: String, required: true },
    
});

module.exports = mongoose.model('Contacto', ContactoSchema);
