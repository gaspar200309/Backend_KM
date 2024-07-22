const Beca = require('../models/Beca');

// Crear una nueva beca
exports.createBeca = async (req, res) => {
    try {
        const newBeca = new Beca(req.body);
        const savedBeca = await newBeca.save();
        res.status(201).json(savedBeca);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todas las becas
exports.getBecas = async (req, res) => {
    try {
        const becas = await Beca.find();
        res.status(200).json(becas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una beca por id
exports.getBecaById = async (req, res) => {
    try {
        const beca = await Beca.findById(req.params.id);
        if (!beca) return res.status(404).json({ message: 'Beca no encontrada' });
        res.status(200).json(beca);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar una beca por id
exports.updateBeca = async (req, res) => {
    try {
        const updatedBeca = await Beca.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBeca) return res.status(404).json({ message: 'Beca no encontrada' });
        res.status(200).json(updatedBeca);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una beca por id
exports.deleteBeca = async (req, res) => {
    try {
        const deletedBeca = await Beca.findByIdAndDelete(req.params.id);
        if (!deletedBeca) return res.status(404).json({ message: 'Beca no encontrada' });
        res.status(200).json({ message: 'Beca eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
