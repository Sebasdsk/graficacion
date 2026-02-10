import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json()); 

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
    console.log(`Base de datos conectada a: ${process.env.DB_NAME}`);
});
