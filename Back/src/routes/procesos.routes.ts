import { Router, Request, Response } from 'express';
import { pool } from '../config/db';
import { verifyToken } from '../middleware/auth.middleware';
import { prisma } from "../../lib/prisma";

const router = Router();

// Obtener procesos de un proyecto
router.get('/proyecto/:id_proyecto', verifyToken, async (req: any, res: Response) => {
    try {
        const { id_proyecto } = req.params;

        // Se usa JSON_AGG para traer los subprocesos tambien y salgan en una sola consulta
        const query = `
            SELECT 
                p.id_proceso,
                p.nombre,
                p.descripcion,
                p.codigo_orden, -- Ej: "1"
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id_subproceso', s.id_subproceso,
                            'nombre', s.nombre,
                            'descripcion', s.descripcion,
                            'codigo_orden', s.codigo_orden 
                        ) ORDER BY s.codigo_orden ASC
                    ) FILTER (WHERE s.id_subproceso IS NOT NULL), 
                    '[]'
                ) as subprocesos
            FROM proceso p
            LEFT JOIN subproceso s ON p.id_proceso = s.id_proceso
            WHERE p.id_proyecto = $1
            GROUP BY p.id_proceso
            ORDER BY p.codigo_orden ASC; 
        `;

        const result = await pool.query(query, [id_proyecto]);
        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener la orden de procesos');
    }
});

// Crear proceso
router.post('/crear_proceso', verifyToken, async (req: any, res: Response) => {
    const client = await pool.connect();
    try {
        const { nombre, descripcion, id_proyecto } = req.body;
        
        await client.query('BEGIN');

        const countQuery = 'SELECT COUNT(*) FROM proceso WHERE id_proyecto = $1';
        const countRes = await client.query(countQuery, [id_proyecto]);
        const nextOrder = parseInt(countRes.rows[0].count) + 1; 

        const insertQuery = `
            INSERT INTO proceso (nombre, descripcion, id_proyecto, codigo_orden) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `;
        const result = await client.query(insertQuery, [nombre, descripcion, id_proyecto, nextOrder]);
        
        await client.query('COMMIT');
        res.json(result.rows[0]);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).send('Error al crear proceso');
    } finally {
        client.release();
    }
});

// Crear un subproceso como parte de un proceso
router.post('/subproceso', verifyToken, async (req: any, res: Response) => {
    const client = await pool.connect();
    try {
        const { nombre, descripcion, id_proceso } = req.body;

        await client.query('BEGIN');

        const countQuery = 'SELECT COUNT(*) FROM subproceso WHERE id_proceso = $1';
        const countRes = await client.query(countQuery, [id_proceso]);
        const nextOrder = parseInt(countRes.rows[0].count) + 1; 

        const insertQuery = `
            INSERT INTO subproceso (nombre, descripcion, id_proceso, codigo_orden) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `;
        
        const result = await client.query(insertQuery, [nombre, descripcion, id_proceso, nextOrder]);
        
        await client.query('COMMIT');
        res.json(result.rows[0]);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).send('Error al crear subproceso');
    } finally {
        client.release();
    }
});

// Método para obtener un subproceso por ID (Para la pantalla de las técnicas de recolección)
router.get('/subproceso/:id_subproceso', verifyToken, async (req: any, res: Response) => {
    const { id_subproceso } = req.params;

    try {
        const subproceso = await prisma.subproceso.findUnique({
            where: {
                id_subproceso: Number(id_subproceso)
            },
            include: {
                proceso: true
            }
        });

        res.json(subproceso);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener subproceso');
    }
});

export default router;