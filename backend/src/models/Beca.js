const mongoose = require('mongoose');

const BecaSchema = new mongoose.Schema({
    imgSrc: String,
    universidad: String,
    dato: String,
    descripcion: String
});

module.exports = mongoose.model('Beca', BecaSchema);
