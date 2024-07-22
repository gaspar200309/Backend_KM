const mongoose = require('mongoose');

const CarreraSchema = new mongoose.Schema({
    idCar: { type: Number, required: true, unique: true },
    imgSrc: { type: String, required: true },
    titulo: { type: String, required: true },
    duracion: { type: String, required: true },
    descripcion: { type: String, required: true },
    area: { type: String, required: true },
    lugaresDeTrabajo: { type: [String], required: true },
    materias: { type: [String], required: true },
    universidades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Universidad' }]
});

module.exports = mongoose.model('Carrera', CarreraSchema);
