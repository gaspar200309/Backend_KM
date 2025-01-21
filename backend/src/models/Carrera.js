const mongoose = require('mongoose');

const CarreraSchema = new mongoose.Schema({
    idCar: {type: String, required: true, unique: true},
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    lugaresDeTrabajo: { type: [String], required: true },
    materias: { type: [String], required: true },
    universidades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Universidad', default: [] }],
    area: { type: String, required: true },
    nivel: { type: String, required: true },
    video: { type: String },
    duracion: { type: String },
    imgSrc: { type: String, required: true }
});

module.exports = mongoose.model('Carrera', CarreraSchema);
