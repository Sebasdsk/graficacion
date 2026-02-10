const { Pool } = require('pg');
require('dotenv').config();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on('connect', () => {
    console.log('Base de datos conectada exitosamente');
});

pool.on('error', (err: any) => {
    console.error('Error en la conexion a la Base de datos', err);
    process.exit(-1);
});

module.exports = pool;