import { Router, Request, Response } from 'express';
import { pool } from '../config/db';

const router = Router();

// Obtener lista de roles 
router.get('/lista-roles', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM rol ORDER BY id_rol ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener roles' });
    }
});

// Crear nuevo rol 
router.post('/crear-rol', async (req: Request, res: Response) => {
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
router.post('/asignar', async (req: Request, res: Response): Promise<any> => {
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
router.delete('/eliminar/:id_participacion', async (req: Request, res: Response) => {
    try {
        const { id_participacion } = req.params;
        await pool.query('DELETE FROM proyecto_participante WHERE id_participacion = $1', [id_participacion]);
        res.json({ message: 'Interesado eliminado del proyecto' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

export default router;