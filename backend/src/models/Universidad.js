const mongoose = require('mongoose');

const UniversidadSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    enlace: { type: String, required: true },
    logo: { type: String, required: true }
});

module.exports = mongoose.model('Universidad', UniversidadSchema);
