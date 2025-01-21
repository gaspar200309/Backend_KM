const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConf');
const Universidad = require('../models/Universidad');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'universidades', 
        allowed_formats: ['jpg', 'png'], 
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

const upload = multer({ storage }).single('logo');

const parseDirecciones = (direcciones) => {
    try {
        if (typeof direcciones === 'string') {
            return JSON.parse(direcciones); // Parsear si llega como cadena
        }
        if (Array.isArray(direcciones)) {
            return direcciones; // Si ya es un array, devolverlo directamente
        }
        throw new Error('El campo "direcciones" debe ser un array válido o una cadena JSON');
    } catch (err) {
        throw new Error('Error al parsear el campo "direcciones": ' + err.message);
    }
};


exports.createUniversidad = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ message: err.message });

        try {
            if (typeof req.body.direcciones === 'string') {
                req.body.direcciones = JSON.parse(req.body.direcciones);
            }

            const newUniversidad = new Universidad({
                ...req.body,
                logo: req.file ? req.file.path : '', 
            });

            const savedUniversidad = await newUniversidad.save();
            res.status(201).json(savedUniversidad);
        } catch (error) {
            console.error("Error al registrar universidad:", error);
            res.status(500).json({ message: error.message });
        }
    });
};

exports.updateUniversidad = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ message: 'Error al cargar archivo: ' + err.message });

        try {
            const updatedData = { ...req.body };

            // Parsear direcciones si están presentes
            if (req.body.direcciones) {
                updatedData.direcciones = parseDirecciones(req.body.direcciones);
            }

            // Actualizar logo si hay un nuevo archivo
            if (req.file) {
                updatedData.logo = req.file.path;

                // Eliminar el logo anterior de Cloudinary
                const universidad = await Universidad.findById(req.params.id);
                if (universidad && universidad.logo) {
                    const publicId = universidad.logo.split('/').slice(-2).join('/').split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                }
            }

            const updatedUniversidad = await Universidad.findByIdAndUpdate(req.params.id, updatedData, { new: true });
            if (!updatedUniversidad) return res.status(404).json({ message: 'Universidad no encontrada' });

            res.status(200).json(updatedUniversidad);
        } catch (error) {
            console.error('Error al actualizar universidad:', error);
            res.status(400).json({ message: error.message });
        }
    });
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

// Obtener universidad por ID
exports.getUniversidadById = async (req, res) => {
    try {
        const universidad = await Universidad.findById(req.params.id);
        if (!universidad) return res.status(404).json({ message: 'Universidad no encontrada' });
        res.status(200).json(universidad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar universidad
exports.deleteUniversidad = async (req, res) => {
    try {
        const universidad = await Universidad.findById(req.params.id);
        if (!universidad) return res.status(404).json({ message: 'Universidad no encontrada' });

        // Eliminar logo de Cloudinary
        if (universidad.logo) {
            const publicId = universidad.logo.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`universidades/${publicId}`);
        }

        await Universidad.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Universidad eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener universidades recomendadas
exports.getUniversidadesRecomendadas = async (req, res) => {
    try {
        const publicas = await Universidad.aggregate([
            { $match: { esPublica: 'publica' } },
            { $sample: { size: 5 } },
        ]);

        const privadas = await Universidad.aggregate([
            { $match: { esPublica: 'privada' } },
            { $sample: { size: 5 } },
        ]);

        const recomendadas = [...publicas, ...privadas];
        res.status(200).json(recomendadas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener institutos
exports.getInstitutos = async (req, res) => {
    try {
        const institutos = await Universidad.find({ tipoEscuela: 'Instituto' });
        res.status(200).json(institutos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
