const Contacto = require('../models/contacto');

//Quiero hacer un controlador para crear comentario
exports.creaContacto = async (req, res) => {
    try {
        const newContacto = new Contacto(req.body)
        const savedContacto = await newContacto.save();
        res.status(201).json(savedContacto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
