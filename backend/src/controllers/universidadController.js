const Universidad = require('../models/Universidad');

// Crear una nueva universidad
exports.createUniversidad = async (req, res) => {
    try {
        const newUniversidad = new Universidad(req.body);
        const savedUniversidad = await newUniversidad.save();
        res.status(201).json(savedUniversidad);
    } catch (error) {
        console.error("Error al registrar la universidad", error)
        res.status(500).json({ message: error.message });
    }
};

// Obtener todas las universidades
exports.getUniversidades = async (req, res) => {
    try {
        const universidades = await Universidad.find();
        res.status(200).json(universidades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una universidad por id
exports.getUniversidadById = async (req, res) => {
    try {
        const universidad = await Universidad.findById(req.params.id);
        if (!universidad) return res.status(404).json({ message: 'Universidad no encontrada' });
        res.status(200).json(universidad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar una universidad por id
exports.updateUniversidad = async (req, res) => {
    try {
        const updatedUniversidad = await Universidad.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUniversidad) return res.status(404).json({ message: 'Universidad no encontrada' });
        res.status(200).json(updatedUniversidad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una universidad por id
exports.deleteUniversidad = async (req, res) => {
    try {
        const deletedUniversidad = await Universidad.findByIdAndDelete(req.params.id);
        if (!deletedUniversidad) return res.status(404).json({ message: 'Universidad no encontrada' });
        res.status(200).json({ message: 'Universidad eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
