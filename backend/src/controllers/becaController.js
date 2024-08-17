const multer = require('multer');
const path = require('path');

// Configuración de multer para almacenar imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Crear una nueva beca con imagen
exports.createBeca = [upload.single('imgSrc'), async (req, res) => {
    try {
        const becaData = { ...req.body };
        if (req.file) {
            becaData.imgSrc = `/uploads/${req.file.filename}`;
        }
        const newBeca = new Beca(becaData);
        const savedBeca = await newBeca.save();
        res.status(201).json(savedBeca);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}];

// Actualizar una beca por id con imagen
exports.updateBeca = [upload.single('imgSrc'), async (req, res) => {
    try {
        const becaData = { ...req.body };
        if (req.file) {
            becaData.imgSrc = `/uploads/${req.file.filename}`;
        }
        const updatedBeca = await Beca.findByIdAndUpdate(req.params.id, becaData, { new: true });
        if (!updatedBeca) return res.status(404).json({ message: 'Beca no encontrada' });
        res.status(200).json(updatedBeca);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}];

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
