import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar rutas
import login from './auth';
import proyectosRoutes from './routes/proyectos.routes';
import procesosRoutes from './routes/procesos.routes';
import rolesRoutes from './routes/roles.routes';
import entrevistaRoutes from './routes/Tecnicas/entrevista.routes';
import preguntasEntrevistaRoutes from './routes/Tecnicas/preguntas-entrevista.routes' ;
import observacionesRoutes from './routes/Tecnicas/observaciones.routes';
import stakeholdersRoutes from './routes/stakeholders.routes';
import diagramasUMLRoutes from './routes/umls.routes';

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
app.use('/api/roles', rolesRoutes);
app.use('/api/entrevista', entrevistaRoutes);
app.use('/api/preguntasEntrevista', preguntasEntrevistaRoutes);
app.use('/api/observaciones', observacionesRoutes);
app.use('/api/stakeholders', stakeholdersRoutes);
app.use('/api/diagramasUML', diagramasUMLRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Servidor corriendo');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
    const dbUrl = new URL(process.env.DATABASE_URL!);
    console.log(`Base de datos conectada a: ${dbUrl.pathname.replace('/', '')}`);
});
