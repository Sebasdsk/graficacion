import { Router, Request, Response } from 'express';
import { pool } from '../config/db'; 

const router = Router();

// Endpoint para las estadisticas de proyectos de usuarios
router.get('/estadisticas', async (req: Request, res: Response) => {
  try {
    const { id_usuario } = req.query; 

    const query = `
      SELECT 
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE estatus = 'En Progreso') AS en_proceso,
        COUNT(*) FILTER (WHERE estatus = 'Completado') AS completados
      FROM proyecto
      WHERE id_usuario_creador = $1
    `;
    
    const result = await pool.query(query, [id_usuario]);

    if (result.rows.length === 0) {
        return res.json({ total: 0, en_proceso: 0, completados: 0 });
    }

    res.json(result.rows[0]); 

  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener estadisticas');
  }
});

// Endpoint para la lista de proyectos
router.get('/lista', async (req: Request, res: Response) => {
  try {
    const { id_usuario } = req.query;

    const query = `
      SELECT 
        p.id_proyecto,
        p.nombre,
        p.descripcion,
        p.estatus,
        p.fecha_inicio,
        (SELECT COUNT(*) FROM proceso WHERE id_proyecto = p.id_proyecto) as num_procesos,
        (SELECT COUNT(DISTINCT sp.id_stakeholder) 
         FROM proceso_stakeholder_participacion sp
         JOIN proceso proc ON sp.id_proceso = proc.id_proceso
         WHERE proc.id_proyecto = p.id_proyecto) as num_colaboradores
      FROM proyecto p
      WHERE p.id_usuario_creador = $1
      ORDER BY p.id_proyecto DESC
    `;

    const result = await pool.query(query, [id_usuario]);

    const proyectos = result.rows.map((p: any) => ({
      ...p,
      fecha_inicio: p.fecha_inicio ? new Date(p.fecha_inicio).toISOString().split('T')[0] : null
    }));

    res.json(proyectos);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener proyectos');
  }
});

// Endpoint para crear proyecto
router.post('/crear_proyecto', async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, fecha_inicio, id_usuario } = req.body;

    const query = `
      INSERT INTO proyecto (nombre, descripcion, fecha_inicio, id_usuario_creador, estatus) 
      VALUES ($1, $2, $3, $4, 'Planificación') 
      RETURNING *
    `;
    
    const result = await pool.query(query, [nombre, descripcion, fecha_inicio, id_usuario]);
    res.json({ message: 'Proyecto creado con éxito', project: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear proyecto');
  }
});

// Actualizar un proyecto
router.put('/actualizar/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, fecha_fin, estatus, problema_a_resolver } = req.body;

    const query = `
      UPDATE proyecto
      SET nombre = $1, descripcion = $2, fecha_fin = $3, estatus = $4, problema_a_resolver = $5
      WHERE id_proyecto = $6
      RETURNING *
    `;
    const values = [nombre, descripcion, fecha_fin, estatus, problema_a_resolver, id];
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error actualizando proyecto');
  }
});

export default router;