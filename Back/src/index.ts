import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar rutas
import login from './auth';
import proyectosRoutes from './routes/proyectos.routes';
import procesosRoutes from './routes/procesos.routes';
import interesadosProyectosRoutes from './routes/interesados-proyecto.routes';

dotenv.config();

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json()); 

// Rutas
app.use('/api/auth', login);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/procesos', procesosRoutes);
app.use('/api/interesados-proyecto', interesadosProyectosRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('esta jalando');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
    console.log(`Base de datos conectada a: ${process.env.DB_NAME}`);
});
