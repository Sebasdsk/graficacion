import { Router, Request, Response } from 'express';
import { pool } from '../config/db';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// Obtener lista de roles 
router.get('/lista-roles', verifyToken, async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM rol ORDER BY id_rol ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener roles' });
    }
});

// Lista de los roles asignados a un proyecto
router.get('/proyecto/:id_proyecto', verifyToken, async (req: Request, res: Response) => {
    try {
        const { id_proyecto } = req.params;
        const query = `
          SELECT 
              pp.id_participacion,
              u.nombre as nombre_usuario,
              r.nombre as nombre_rol,
              pp.fecha_asignacion
          FROM proyecto_participante pp
          JOIN usuario u ON pp.id_usuario = u.id_usuario
          JOIN rol r ON pp.id_rol = r.id_rol
          WHERE pp.id_proyecto = $1 AND pp.activo = true
        `;
        const result = await pool.query(query, [id_proyecto]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener lista' });
    }
  });

// Crear nuevo rol 
router.post('/crear-rol', verifyToken, async (req: Request, res: Response) => {
    try {
        const { nombre } = req.body;
        if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

        const result = await pool.query('INSERT INTO rol (nombre) VALUES ($1) RETURNING *', [nombre]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear rol' });
    }
});

// Asignar un usuario a un proyecto con un rol específico
router.post('/asignar', verifyToken, async (req: Request, res: Response): Promise<any> => {
  try {
      const { id_usuario, id_rol, id_proyecto } = req.body; 

      if (!id_usuario || !id_rol || !id_proyecto) {
          return res.status(400).json({ message: 'Faltan datos (usuario, rol o proyecto)' });
      }

      const query = `
        INSERT INTO proyecto_participante (id_usuario, id_rol, id_proyecto)
        VALUES ($1, $2, $3) 
        RETURNING *
      `;
      
      const result = await pool.query(query, [id_usuario, id_rol, id_proyecto]);
      res.json({ message: 'Interesado asignado correctamente', data: result.rows[0] });

  } catch (err: any) {
      console.error(err);
      if (err.code === '23505') { 
          return res.status(400).json({ message: 'Este usuario ya tiene ese rol en el proyecto' });
      }
      res.status(500).json({ error: 'Error al asignar interesado' });
  }
});

// Eliminar interesado del proyecto
router.patch('/eliminar/:id_participacion', verifyToken, async (req: Request, res: Response) => {
    try {
        const { id_participacion } = req.params;
        
        // Similar al endpoint de "cancelar" proyecto, damos "baja" al usuario en el proyecto pero conservamos el historial
        const query = `
            UPDATE proyecto_participante 
            SET activo = false, fecha_salida = CURRENT_DATE
            WHERE id_participacion = $1
            RETURNING *
        `;
        
        const result = await pool.query(query, [id_participacion]);
        
        res.json({ 
            message: 'Interesado marcado como baja', 
            data: result.rows[0] 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al dar de baja' });
    }
});

export default router;