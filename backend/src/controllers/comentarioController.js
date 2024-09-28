const Comentario = require('../models/comentarios');

//Quiero hacer un controlador para crear comentario
exports.createComentario = async (req, res) => {
    try {
        const newComentario = new Comentario(req.body);
        const savedComentario = await newComentario.save();
        res.status(201).json(savedComentario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
