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

/* const clientUrl = process.env.NODE_ENV === 'production' 
    ? process.env.PROD_CLIENT_URL 
    : process.env.DEV_CLIENT_URL; */

const clientUrls = [
    process.env.DEV_CLIENT_URL,
    process.env.PROD_CLIENT_URL
];
    
app.use(cors({
    origin: clientUrls,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true 
}));

app.use('/', routes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
