import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar rutas
import login from './auth';
import proyectosRoutes from './routes/proyectos.routes';
import procesosRoutes from './routes/procesos.routes';
import rolesRoutes from './routes/roles.routes';
import tecnicasRoutes from './routes/tecnicas.routes';
import entrevistaRoutes from './routes/Tecnicas/entrevista.routes';
import preguntasEntrevistaRoutes from './routes/Tecnicas/preguntas-entrevista.routes';
import historiasUsuarioRoutes from './routes/Tecnicas/historias-usuario.routes';
import observacionesRoutes from './routes/Tecnicas/observaciones.routes';
import focusGroupRoutes from './routes/Tecnicas/focus-group.routes';
import cuestionarioRoutes from './routes/Tecnicas/cuestionario.routes';
import documentosRoutes from './routes/Tecnicas/documentos.routes';
import seguimientoRoutes from './routes/Tecnicas/seguimiento.routes';
import stakeholdersRoutes from './routes/stakeholders.routes';
import diagramasUMLRoutes from './routes/umls.routes';
import previewRoutes from './routes/Specs.routes';

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
app.use('/api/tecnicas', tecnicasRoutes);
app.use('/api/entrevistas', entrevistaRoutes);
app.use('/api/preguntasEntrevista', preguntasEntrevistaRoutes);
app.use('/api/historiasUsuario', historiasUsuarioRoutes);
app.use('/api/observaciones', observacionesRoutes);
app.use('/api/focusGroup', focusGroupRoutes);
app.use('/api/cuestionarios', cuestionarioRoutes);
app.use('/api/documentos', documentosRoutes);
app.use('/api/seguimiento', seguimientoRoutes);
app.use('/api/stakeholders', stakeholdersRoutes);
app.use('/api/diagramasUML', diagramasUMLRoutes);
app.use('/api/specs', previewRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Servidor corriendo');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
    const dbUrl = new URL(process.env.DATABASE_URL!);
    console.log(`Base de datos conectada a: ${dbUrl.pathname.replace('/', '')}`);
});
