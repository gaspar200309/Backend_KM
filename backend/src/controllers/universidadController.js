const multer = require('multer');
const path = require('path');
const Universidad = require('../models/Universidad');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConf'); // Archivo de configuración de Cloudinary

// Configurar el almacenamiento de multer para Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'universidades', // Carpeta en Cloudinary
        allowed_formats: ['jpg', 'png'],
        public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Nombre del archivo en Cloudinary
    },
});

// Middleware de multer para manejo de archivos
const upload = multer({ storage }).single('logo');

// Función para crear una universidad
exports.createUniversidad = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        try {
            console.log("Body recibido:", req.body);
            console.log("Archivo recibido:", req.file);

            // Parsear 'direcciones' si se recibe como string
            if (typeof req.body.direcciones === 'string') {
                req.body.direcciones = JSON.parse(req.body.direcciones);
            }

            const newUniversidad = new Universidad({
                ...req.body,
                logo: req.file ? req.file.path : '' // Guardar la URL del archivo en Cloudinary
            });
            const savedUniversidad = await newUniversidad.save();
            res.status(201).json(savedUniversidad);
        } catch (error) {
            console.error("Error al registrar la universidad", error);
            res.status(500).json({ message: error.message });
        }
    });
};

// Función para actualizar una universidad
exports.updateUniversidad = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        try {
            const updatedData = {
                ...req.body,
                logo: req.file ? req.file.path : req.body.logo // Actualiza logo si se sube una nueva imagen
            };
            const updatedUniversidad = await Universidad.findByIdAndUpdate(req.params.id, updatedData, { new: true });
            if (!updatedUniversidad) return res.status(404).json({ message: 'Universidad no encontrada' });
            res.status(200).json(updatedUniversidad);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};

// Función para obtener todas las universidades
exports.getUniversidades = async (req, res) => {
    try {
        const universidades = await Universidad.find();
        res.status(200).json(universidades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Función para obtener una universidad por ID
exports.getUniversidadById = async (req, res) => {
    try {
        const universidad = await Universidad.findById(req.params.id);
        if (!universidad) return res.status(404).json({ message: 'Universidad no encontrada' });
        res.status(200).json(universidad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Función para eliminar una universidad y su logo en Cloudinary
exports.deleteUniversidad = async (req, res) => {
    try {
        const universidad = await Universidad.findById(req.params.id);
        if (!universidad) return res.status(404).json({ message: 'Universidad no encontrada' });

        // Eliminar el logo de Cloudinary si existe
        if (universidad.logo) {
            const publicId = universidad.logo.split('/').pop().split('.')[0]; // Obtener el public_id de la imagen
            await cloudinary.uploader.destroy(`universidades/${publicId}`); // Eliminar la imagen de Cloudinary
        }

        await Universidad.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Universidad eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Función para obtener universidades recomendadas (5 públicas y 5 privadas)
exports.getUniversidadesRecomendadas = async (req, res) => {
    try {
        const publicas = await Universidad.aggregate([
            { $match: { esPublica: 'publica' } },
            { $sample: { size: 5 } } // Muestra aleatoria de 5 universidades públicas
        ]);

        const privadas = await Universidad.aggregate([
            { $match: { esPublica: 'privada' } },
            { $sample: { size: 5 } } // Muestra aleatoria de 5 universidades privadas
        ]);

        const recomendadas = [...publicas, ...privadas].slice(0, 10); // Combinar y limitar a 10
        res.status(200).json(recomendadas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Función para obtener institutos
exports.getInstitutos = async (req, res) => {
    try {
        const institutos = await Universidad.find({ tipoEscuela: 'Instituto' });
        res.status(200).json(institutos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
