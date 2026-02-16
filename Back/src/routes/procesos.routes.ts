import { Router, Request, Response } from 'express';
import { pool } from '../config/db';

const router = Router();

// Obtener procesos de un proyecto 
router.get('/proyecto/:id_proyecto', async (req: Request, res: Response) => {
    try {
        const { id_proyecto } = req.params;

        const resultProcesos = await pool.query('SELECT * FROM proceso WHERE id_proyecto = $1', [id_proyecto]);
        const procesos = resultProcesos.rows;
        const listaCompleta = await Promise.all(procesos.map(async (proc: any) => {
            
            // Se buscan los subprocesos del proceso en cuestion
            const resultSubs = await pool.query('SELECT * FROM subproceso WHERE id_proceso = $1', [proc.id_proceso]);
            
            return { 
                ...proc, 
                subprocesos: resultSubs.rows 
            };
        }));

        res.json(listaCompleta);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los procesos');
    }
});

// Crear proceso
router.post('/crear_proceso', async (req: Request, res: Response) => {
    try {
        const { nombre, descripcion, id_proyecto } = req.body;

        const result = await pool.query(
            'INSERT INTO proceso (nombre, descripcion, id_proyecto) VALUES ($1, $2, $3) RETURNING *',
            [nombre, descripcion, id_proyecto]
        );
        
        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error al crear proceso');
    }
});

// Crear un subproceso como parte de un proceso
router.post('/subproceso', async (req: Request, res: Response) => {
    try {
        const { nombre, descripcion, id_proceso } = req.body;

        const result = await pool.query(
            'INSERT INTO subproceso (nombre, descripcion, id_proceso) VALUES ($1, $2, $3) RETURNING *',
            [nombre, descripcion, id_proceso]
        );
        
        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error al crear subproceso');
    }
});

export default router;