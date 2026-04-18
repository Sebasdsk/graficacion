import { Router, Request, Response } from 'express';
import { pool } from '../config/db'; 
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// Endpoint para las estadisticas de proyectos de usuarios
router.get('/estadisticas', verifyToken, async (req: any, res: Response) => {
  try {
    const id_usuario = req.usuario.id; 

    const query = `
      SELECT 
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE estatus = 'En Progreso')::int AS en_proceso,
        COUNT(*) FILTER (WHERE estatus = 'Completado')::int AS completados
      FROM proyecto
      WHERE id_usuario_creador = $1
    `;
    
    const result = await pool.query(query, [id_usuario]);

    res.json(result.rows[0]); 

  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener estadisticas');
  }
});

// Endpoint para la lista de proyectos
router.get('/lista', verifyToken, async (req: any, res: Response) => { 
  try {
    const id_usuario = req.usuario.id; 

    const query = `
      SELECT 
        p.id_proyecto,
        p.nombre,
        p.descripcion,
        p.estatus,
        p.fecha_inicio,
        (SELECT COUNT(*) FROM proceso WHERE id_proyecto = p.id_proyecto)::int as num_procesos,
        
        (SELECT COUNT(*) 
         FROM proyecto_participante pp
         WHERE pp.id_proyecto = p.id_proyecto)::int as num_colaboradores
         
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
router.post('/crear_proyecto', verifyToken, async (req: any, res: Response): Promise<any> => {
  const client = await pool.connect();
  
  try {
    // Agregamos id_usuario_po y id_usuario_tl
    const { nombre, descripcion, fecha_inicio, id_usuario_po, id_usuario_tl } = req.body;
    const id_usuario_creador = req.usuario.id; 

    if (!id_usuario_po || !id_usuario_tl) {
        return res.status(400).json({ message: 'Falta asignar al Product Owner y/o Tech Lead iniciales' });
    }

    await client.query('BEGIN');

    const queryProyecto = `
      INSERT INTO proyecto (nombre, descripcion, fecha_inicio, id_usuario_creador, estatus) 
      VALUES ($1, $2, $3, $4, 'Planificación') 
      RETURNING *
    `;
    const resProyecto = await client.query(queryProyecto, [nombre, descripcion, fecha_inicio, id_usuario_creador]);
    const nuevoProyecto = resProyecto.rows[0];

    const queryPO = `
      INSERT INTO proyecto_participante (id_proyecto, id_usuario, id_rol, activo)
      VALUES ($1, $2, (SELECT id_rol FROM rol WHERE nombre = 'Product Owner' LIMIT 1), true)
    `;
    await client.query(queryPO, [nuevoProyecto.id_proyecto, id_usuario_po]);

    const queryTL = `
      INSERT INTO proyecto_participante (id_proyecto, id_usuario, id_rol, activo)
      VALUES ($1, $2, (SELECT id_rol FROM rol WHERE nombre = 'Tech Lead' LIMIT 1), true)
    `;
    await client.query(queryTL, [nuevoProyecto.id_proyecto, id_usuario_tl]);

    await client.query('COMMIT');

    res.json({ message: 'Proyecto creado y equipo inicial asignado', project: nuevoProyecto });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).send('Error al crear proyecto. Verifica que los roles existan en la BD.');
  } finally {
    client.release();
  }
});

// Endpoint para ver un proyecto
router.get('/ver/:id', verifyToken, async (req: any, res: Response): Promise<any> => { 
    try {
        const { id } = req.params;
        const id_usuario = req.usuario.id;

        const result = await pool.query(
            'SELECT * FROM proyecto WHERE id_proyecto = $1 AND id_usuario_creador = $2', 
            [id, id_usuario]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Proyecto no encontrado o no tienes permiso' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al ver proyecto');
    }
});

// Actualizar un proyecto
router.put('/actualizar/:id', verifyToken, async (req: any, res: Response): Promise<any> => { 
  try {
    const { id } = req.params;
    const id_usuario = req.usuario.id;
    const { nombre, descripcion, fecha_fin, estatus, problema_a_resolver } = req.body;

    const query = `
      UPDATE proyecto
      SET nombre = $1, descripcion = $2, fecha_fin = $3, estatus = $4, problema_a_resolver = $5
      WHERE id_proyecto = $6 AND id_usuario_creador = $7
      RETURNING *
    `;
    const values = [nombre, descripcion, fecha_fin, estatus, problema_a_resolver, id, id_usuario];
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No se pudo actualizar (No existe o no eres el dueño)' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error actualizando proyecto');
  }
});

// Endpoint para marcar como proyecto "cancelado"
router.patch('/:id/cancelar', verifyToken, async (req: any, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const id_usuario = req.usuario.id; 

        const query = `
            UPDATE proyecto 
            SET estatus = 'Cancelado' 
            WHERE id_proyecto = $1 AND id_usuario_creador = $2
            RETURNING *
        `;
        
        const result = await pool.query(query, [id, id_usuario]);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                message: 'No se pudo cancelar ya que no existe o no eres dueño de este' 
            });
        }

        res.json({ 
            message: 'Proyecto cancelado', 
            proyecto: result.rows[0] 
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error al cancelar proyecto');
    }
});

// Endpoint para listar usuarios disponibles para asignar roles
router.get('/lista-usuarios', verifyToken, async (req: Request, res: Response) => {
    try {
        // Se pide el id y el nombre para armar la lista
        const query = `
            SELECT 
                id_usuario, 
                nombre, 
                apellido_paterno,
                apellido_materno, 
                email 
            FROM usuario 
            ORDER BY nombre ASC
        `;
        
        const result = await pool.query(query);
        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el catalogo de usuarios' });
    }
});

export default router;