const multer = require('multer');
const path = require('path');
const Universidad = require('../models/Universidad');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');  
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage }).single('logo');

exports.createUniversidad = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        try {
            console.log("Body recibido:", req.body);
            console.log("Archivo recibido:", req.file);

            if (typeof req.body.direcciones === 'string') {
                req.body.direcciones = JSON.parse(req.body.direcciones);
            }

            const newUniversidad = new Universidad({
                ...req.body,
                logo: req.file ? `/uploads/${req.file.filename}` : ''
            });
            const savedUniversidad = await newUniversidad.save();
            res.status(201).json(savedUniversidad);
        } catch (error) {
            console.error("Error al registrar la universidad", error);
            res.status(500).json({ message: error.message });
        }
    });
};

exports.updateUniversidad = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        try {
            const updatedData = {
                ...req.body,
                logo: req.file ? `/uploads/${req.file.filename}` : req.body.logo
            };
            const updatedUniversidad = await Universidad.findByIdAndUpdate(req.params.id, updatedData, { new: true });
            if (!updatedUniversidad) return res.status(404).json({ message: 'Universidad no encontrada' });
            res.status(200).json(updatedUniversidad);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};

exports.getUniversidades = async (req, res) => {
    try {
        const universidades = await Universidad.find();
        res.status(200).json(universidades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUniversidadById = async (req, res) => {
    try {
        const universidad = await Universidad.findById(req.params.id);
        if (!universidad) return res.status(404).json({ message: 'Universidad no encontrada' });
        res.status(200).json(universidad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUniversidad = async (req, res) => {
    try {
        const deletedUniversidad = await Universidad.findByIdAndDelete(req.params.id);
        if (!deletedUniversidad) return res.status(404).json({ message: 'Universidad no encontrada' });
        res.status(200).json({ message: 'Universidad eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUniversidadesRecomendadas = async (req, res) => {
    try {
        const publicas = await Universidad.aggregate([
            { $match: { esPublica: 'publica' } }, 
            { $sample: { size: 5 } } 
        ]);

        const privadas = await Universidad.aggregate([
            { $match: { esPublica: 'privada' } }, 
            { $sample: { size: 5 } } 
        ]);

        const recomendadas = [...publicas, ...privadas].slice(0, 10);

        res.status(200).json(recomendadas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getInstitutos = async (req, res) => {
    try {
        const institutos = await Universidad.find({ tipoEscuela: 'Instituto' });
        res.status(200).json(institutos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};