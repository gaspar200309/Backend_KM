const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConf"); // Importa la configuración de Cloudinary
const Carrera = require("../models/Carrera");
const Universidad = require("../models/Universidad");
const mongoose = require("mongoose");

// Configurar el almacenamiento de multer para Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "carreras", // Carpeta en Cloudinary
    allowed_formats: ["jpg", "png", "avif"],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Nombre del archivo en Cloudinary
  },
});

const upload = multer({ storage }).single("imgSrc"); // Modificamos para usar Cloudinary

exports.createCarrera = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    try {
      const {
        titulo,
        descripcion,
        lugaresDeTrabajo,
        materias,
        universidades,
        area,
        nivel,
        duracion,
      } = req.body;

      // Valida que las propiedades requeridas no estén vacías
      if (
        !titulo ||
        !descripcion ||
        !lugaresDeTrabajo ||
        !materias ||
        !area ||
        !nivel
      ) {
        return res
          .status(400)
          .json({
            message: "Todos los campos requeridos deben estar completos.",
          });
      }

      const idCar = req.body.idCar || generateUniqueId();

      const newCarrera = new Carrera({
        idCar,
        titulo,
        descripcion,
        lugaresDeTrabajo: Array.isArray(lugaresDeTrabajo)
          ? lugaresDeTrabajo
          : [lugaresDeTrabajo],
        materias: Array.isArray(materias) ? materias : [materias],
        universidades: universidades || [],
        area,
        nivel,
        duracion,
        imgSrc: req.file ? req.file.path : "/uploads/carreras/default.jpg",
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
      const {
        titulo,
        descripcion,
        lugaresDeTrabajo,
        materias,
        universidades,
        area,
        nivel,
        duracion,
      } = req.body;

      // Asegúrate de convertir los IDs de universidades a ObjectId correctamente
      const universidadesIds = Array.isArray(universidades)
        ? universidades
            .filter((id) => mongoose.Types.ObjectId.isValid(id)) // Filtra solo los IDs válidos
            .map((id) => new mongoose.Types.ObjectId(id))
        : [];
   
       
        
      const updatedCarrera = await Carrera.findByIdAndUpdate(
        req.params.id,
        {
          titulo,
          descripcion,
          lugaresDeTrabajo: Array.isArray(lugaresDeTrabajo)
            ? lugaresDeTrabajo
            : [lugaresDeTrabajo],
          materias: Array.isArray(materias) ? materias : [materias],
          universidades: universidadesIds, // Asegúrate de que aquí se pase el array de ObjectId
          area,
          nivel,
          duracion,
          imgSrc: req.file ? req.file.path : undefined, // Actualiza la imagen solo si se proporciona una nueva
        },
        { new: true } // Devuelve el documento actualizado
      );

      if (!updatedCarrera) {
        return res.status(404).json({ message: "Carrera no encontrada." });
      }

      res.status(200).json(updatedCarrera);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

exports.getCarreras = async (req, res) => {
  try {
    const { page = 1, limit = 1000, area, nivel } = req.query;
    const query = {};

    if (area) query.area = area;
    if (nivel) query.nivel = nivel;

    // Seleccionar solo los campos necesarios, excluyendo los no requeridos
    const carreras = await Carrera.find(query)
      .select('-lugaresDeTrabajo -materias -universidades -video -duracion') // Excluir estos campos
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const totalCarreras = await Carrera.countDocuments(query);

    res.status(200).json({
      carreras,
      totalPages: Math.ceil(totalCarreras / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCarreras1 = async (req, res) => {
  try {
    const { page = 1 } = req.query;  // Eliminamos el parámetro 'limit' y se usará sin límite
    const carreras = await Carrera.find()
      .populate("universidades")
      .skip((page - 1) * 10)  // Esto sigue controlando la paginación por páginas, pero sin límite en los resultados
      .select('_id titulo');  // Solo seleccionamos _id y titulo

    res.status(200).json(carreras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCarreraById = async (req, res) => {
  try {
    const carrera = await Carrera.findById(req.params.id).populate(
      "universidades"
    );
    if (!carrera)
      return res.status(404).json({ message: "Carrera no encontrada" });
    res.status(200).json(carrera);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCarrera = async (req, res) => {
  try {
    const carrera = await Carrera.findById(req.params.id);
    if (!carrera)
      return res.status(404).json({ message: "Carrera no encontrada" });

    // Eliminar la imagen de Cloudinary si existe
    if (carrera.imgSrc) {
      const publicId = carrera.imgSrc.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.uploader.destroy(`carreras/${publicId}`); // Eliminar la imagen de Cloudinary
    }

    const deletedCarrera = await Carrera.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Carrera eliminada" });
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
          carrera: { $first: "$$ROOT" },
        },
      },
      { $limit: 10 },
    ]);
    const carrerasPopuladas = await Carrera.populate(
      carrerasPorArea.map((c) => c.carrera),
      { path: "universidades" }
    );

    res.status(200).json(carrerasPopuladas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecommendedCarrerasByArea = async (req, res) => {
  try {
    const carrera = await Carrera.findById(req.params.id);
    if (!carrera)
      return res.status(404).json({ message: "Carrera no encontrada" });

    const carrerasRecomendadas = await Carrera.find({
      area: carrera.area,
      _id: { $ne: carrera._id },
    }).limit(10);

    res.status(200).json(carrerasRecomendadas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
