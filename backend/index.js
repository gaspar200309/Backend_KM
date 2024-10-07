const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const routes = require('./src/api/endPoints');
const cors = require('cors');
const connectDB = require('./src/config/db');

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Lista de URLs permitidas (tanto en desarrollo como en producción)
const allowedOrigins = [
    'http://localhost:5173', // URL del frontend en desarrollo
    'https://proyecto-km-git-main-gaspar200309s-projects.vercel.app' // URL del frontend en producción
];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir solicitudes sin origen (e.g., Postman) o de orígenes permitidos
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true // Permitir el uso de cookies y credenciales
}));

app.use('/', routes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
