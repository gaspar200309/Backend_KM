const multer = require('multer');
const Beca = require('../models/Beca');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConf');


// Configurar el almacenamiento de multer para Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'becas', 
    allowed_formats: ['jpg', 'png'], 
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, 
  },
});

const upload = multer({ storage });

// Crear una nueva beca con imagen
exports.createBeca = [upload.single('imgSrc'), async (req, res) => {
  try {
    const becaData = { ...req.body };

    // Si se ha subido un archivo, almacenar la URL de Cloudinary
    if (req.file) {
      becaData.imgSrc = req.file.path;  // `req.file.path` contiene la URL pública de la imagen en Cloudinary
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
  
      // Si se ha subido una nueva imagen, actualizar la URL en la base de datos
      if (req.file) {
        becaData.imgSrc = req.file.path;  // `req.file.path` contiene la URL pública de la imagen en Cloudinary
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
      const beca = await Beca.findById(req.params.id);
      if (!beca) return res.status(404).json({ message: 'Beca no encontrada' });
  
      if (beca.imgSrc) {
        const publicId = beca.imgSrc.split('/').pop().split('.')[0]; 
        await cloudinary.uploader.destroy(publicId);  
      }
  
      const deletedBeca = await Beca.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Beca eliminada' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
