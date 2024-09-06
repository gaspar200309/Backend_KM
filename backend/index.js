const express = require('express');
const app = express();
const port = process.env.PORT || 3000; 
const routes = require('./src/api/endPoints');
const cors = require('cors');
const connectDB = require('./src/config/db');


connectDB();

// Middleware para parsear JSON
app.use(express.json());


// Middleware para parsear URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const clientUrl = process.env.NODE_ENV === 'production' 
    ? process.env.PROD_CLIENT_URL 
    : process.env.DEV_CLIENT_URL;

app.use(cors({
    origin: [clientUrl],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true 
}));

// Usar las rutas
app.use('/', routes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
