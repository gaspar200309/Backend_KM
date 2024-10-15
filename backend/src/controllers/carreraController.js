const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConf'); // Importa la configuración de Cloudinary
const Carrera = require('../models/Carrera');

// Configurar el almacenamiento de multer para Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'carreras', // Carpeta en Cloudinary
        allowed_formats: ['jpg', 'png'],
        public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Nombre del archivo en Cloudinary
    },
});

const upload = multer({ storage }).single('imgSrc');  // Modificamos para usar Cloudinary

exports.createCarrera = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        try {
            const idCar = req.body.idCar || generateUniqueId();  // Generar ID único si no existe
            const newCarrera = new Carrera({
                ...req.body,
                idCar,
                imgSrc: req.file ? req.file.path : '/uploads/carreras/default.jpg',  // La URL pública de Cloudinary
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
                imgSrc: req.file ? req.file.path : req.body.imgSrc,  // Si se sube una nueva imagen, usa la URL de Cloudinary
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
        const carrera = await Carrera.findById(req.params.id);
        if (!carrera) return res.status(404).json({ message: 'Carrera no encontrada' });

        // Eliminar la imagen de Cloudinary si existe
        if (carrera.imgSrc) {
            const publicId = carrera.imgSrc.split('/').pop().split('.')[0];  // Obtener el public_id de la imagen
            await cloudinary.uploader.destroy(`carreras/${publicId}`);  // Eliminar la imagen de Cloudinary
        }

        const deletedCarrera = await Carrera.findByIdAndDelete(req.params.id);
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

