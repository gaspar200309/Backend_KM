const Carrera = require('../models/Carrera');
const Universidad = require('../models/Universidad');
const Beca = require('../models/Beca');

exports.createCarrera = async (req, res) => {
    try {
        const newCarrera = new Carrera(req.body);
        const savedCarrera = await newCarrera.save();
        res.status(201).json(savedCarrera);
    } catch (error) {
        console.log("Error al crear la carrera", error)
        res.status(500).json({ message: error.message });
    }
};

exports.getCarreras = async (req, res) => {
    try {
        const carreras = await Carrera.find().populate('universidades');
        res.status(200).json(carreras);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCarreraById = async (req, res) => {
    try {
        const carrera = await Carrera.findById(req.params.id).populate('universidades');
        if (!carrera) return res.status(404).json({ message: 'Carrera no encontrada' });
        res.status(200).json(carrera);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCarrera = async (req, res) => {
    try {
        const updatedCarrera = await Carrera.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCarrera) return res.status(404).json({ message: 'Carrera no encontrada' });
        res.status(200).json(updatedCarrera);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCarrera = async (req, res) => {
    try {
        const deletedCarrera = await Carrera.findByIdAndDelete(req.params.id);
        if (!deletedCarrera) return res.status(404).json({ message: 'Carrera no encontrada' });
        res.status(200).json({ message: 'Carrera eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
