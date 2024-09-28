const multer = require('multer');
const path = require('path');
const Carrera = require('../models/Carrera');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/carreras');  
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage }).single('imgSrc');  

exports.createCarrera = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        try {
            const idCar = req.body.idCar || generateUniqueId();  // Puedes usar una función para generar IDs únicos
            
            const newCarrera = new Carrera({
                ...req.body,
                idCar,  // Asegura que idCar tenga un valor
                imgSrc: req.file ? `/uploads/carreras/${req.file.filename}` : '/uploads/carreras/default.jpg'
            });
            const savedCarrera = await newCarrera.save();
            res.status(201).json(savedCarrera);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};

const generateUniqueId = () => {
    return Date.now().toString(); 
};


exports.updateCarrera = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        try {
            const updatedData = {
                ...req.body,
                imgSrc: req.file ? `/uploads/carreras/${req.file.filename}` : req.body.imgSrc  // Actualiza la imagen si se subió una nueva
            };
            const updatedCarrera = await Carrera.findByIdAndUpdate(req.params.id, updatedData, { new: true });
            if (!updatedCarrera) return res.status(404).json({ message: 'Carrera no encontrada' });
            res.status(200).json(updatedCarrera);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
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


exports.deleteCarrera = async (req, res) => {
    try {
        const deletedCarrera = await Carrera.findByIdAndDelete(req.params.id);
        if (!deletedCarrera) return res.status(404).json({ message: 'Carrera no encontrada' });
        res.status(200).json({ message: 'Carrera eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRecommendedCarreras = async (req, res) => {
    try {
        const carrerasPorArea = await Carrera.aggregate([
            {
                $group: {
                    _id: "$area",  
                    carrera: { $first: "$$ROOT" } 
                }
            },
            { $limit: 10 } 
        ]);
        const carrerasPopuladas = await Carrera.populate(carrerasPorArea.map(c => c.carrera), { path: 'universidades' });
        
        res.status(200).json(carrerasPopuladas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

