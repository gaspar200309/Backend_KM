const mongoose = require('mongoose');

const CarreraSchema = new mongoose.Schema({
    idCar: Number,
    imgSrc: String,
    titulo: String,
    duracion: String,
    descripcion: String,
    area: String,
    lugaresDeTrabajo: [String],
    materias: [String],
    universidades: [
        {
            nombre: String,
            enlace: String,
            logo: String
        }
    ]
});

module.exports = mongoose.model('Carrera', CarreraSchema);
