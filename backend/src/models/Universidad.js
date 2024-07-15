const mongoose = require('mongoose');

const UniversidadSchema = new mongoose.Schema({
    nombre: String,
    enlace: String,
    logo: String
});

module.exports = mongoose.model('Universidad', UniversidadSchema);
