const cloudinary = require('cloudinary').v2;
require('dotenv').config(); 

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

console.log('Cloudinary configurado con:', process.env.CLOUD_NAME, process.env.API_KEY);

module.exports = cloudinary;
