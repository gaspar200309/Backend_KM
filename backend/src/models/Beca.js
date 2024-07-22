const mongoose = require('mongoose');

const BecaSchema = new mongoose.Schema({
    imgSrc: { type: String, required: true },
    universidad: { type: mongoose.Schema.Types.ObjectId, ref: 'Universidad', required: true },
    dato: { type: String, required: true },
    descripcion: { type: String, required: true }
});

module.exports = mongoose.model('Beca', BecaSchema);
