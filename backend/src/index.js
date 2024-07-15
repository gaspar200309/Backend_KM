const express = require('express');
const app = express();
const port = 3000;
const routes = require('./api/endPoints');
const cors = require('cors');
const connectDB = require('./config/db');


connectDB();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true 
}));

// Usar las rutas
app.use('/', routes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
