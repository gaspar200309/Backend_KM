const mongoose = require('mongoose');

const BecaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    institucion: { type: String, enum: ['publica', 'privada'], required: true },
    tipo: { type: String, enum: ['universidad', 'instituto', 'normal'], required: true },
    descripcionUniversidad: { type: String, required: true },
    importante: { type: String, required: false },
    promedioRequerido: { type: String, required: false },
    imgSrc: { type: String, required: true },
    becas: {
        social: {
            descripcion: { type: String, required: false }
        },
        trabajo: {
            descripcion: { type: String, required: false }
        },
        excelencia: {
            descripcion: { type: String, required: false }
        }
    },
    direccion: { type: String, required: false }
});

module.exports = mongoose.model('Beca', BecaSchema);
