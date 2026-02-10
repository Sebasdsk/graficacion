import express from 'express';
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

import login from './auth';

const app = express()
app.use(morgan('dev'));

// Middlewares
app.use(cors());
app.use(express.json()); 

app.use('/api/auth', login);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Servido corriendo en el puerto: ${PORT}`)
    console.log(` Base de datos: ${process.env.DB_NAME}`);
})
