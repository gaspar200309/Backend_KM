const mongoose = require('mongoose');

const DireccionSchema = new mongoose.Schema({
    direccion: { type: String, required: true },
    telefono: { type: String },
    fax: { type: String },     
    celular: { type: String }, 
    whatsapp: { type: String },
    correo: { type: String }   
});

const UniversidadSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    direcciones: [DireccionSchema], 
    tipoEscuela: { 
        type: String, 
        required: true, 
        enum: ['Universidad', 'Instituto', 'Normal'] 
    },
    esPublica: { 
        type: String, 
        required: true, 
        enum: ['publica', 'privada'] 
    },
    logo: { type: String, required: false },
    enlace: { type: String, required: true }
});

module.exports = mongoose.model('Universidad', UniversidadSchema);
