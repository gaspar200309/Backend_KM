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
    'http://localhost:5173', 
    'https://proyecto-km-git-main-gaspar200309s-projects.vercel.app',
    'https://proyecto-km.vercel.app'
 ];
 

 app.use(cors({
    origin: function (origin, callback) {
        console.log('Request origin:', origin);  // Añadir para depurar
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true 
}));


app.use('/', routes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
