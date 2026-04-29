import { Router, Request, Response } from 'express';
import prisma from '../config/db';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// Obtener lista de roles 
router.get('/lista-roles', verifyToken, async (req: Request, res: Response) => {
    try {
        const roles = await prisma.rol.findMany({
            orderBy: { id_rol: 'asc' }
        });
        res.json(roles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener roles' });
    }
});

// Lista de los roles asignados a un proyecto
router.get('/proyecto/:id_proyecto', verifyToken, async (req: Request, res: Response) => {
    try {
        const { id_proyecto } = req.params;
        const roles = await prisma.rol.findMany({
            where: {
                id_proyecto: Number(id_proyecto),
            },
        });

        res.json(roles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener lista' });
    }
});

// Crear nuevo rol
router.post('/crear-rol', verifyToken, async (req: Request, res: Response) => {
    try {
        const { nombre, descripcion, estatus, id_proyecto } = req.body;
        if (!nombre || !descripcion || !estatus) return res.status(400).json({ error: 'Campos incompletos.' });

        const rol = await prisma.rol.create({
            data: { nombre, descripcion, estatus, id_proyecto }
        });
        res.json(rol);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear rol' });
    }
});

router.put('/actualizar/:id_rol', verifyToken, async (req: Request, res: Response) => {
    try {
        const { id_rol, nombre, descripcion, estatus } = req.body;

        const rolUpdate = await prisma.rol.update({
            where: {
                id_rol: Number(id_rol),
            },
            data: {
                nombre: nombre,
                descripcion: descripcion,
                estatus: estatus
            }
        });

        res.json({ message: "Rol actualizado correctamente", rolUpdate });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar el rol' });
    }
})

// Asignar un usuario a un proyecto con un rol específico
router.post('/asignar', verifyToken, async (req: Request, res: Response): Promise<any> => {
    try {
        const { id_usuario, id_rol, id_proyecto } = req.body;

        if (!id_usuario || !id_rol || !id_proyecto) {
            return res.status(400).json({ message: 'Faltan datos (usuario, rol o proyecto)' });
        }

        const participante = await prisma.proyecto_participante.create({
            data: {
                id_usuario,
                id_rol,
                id_proyecto
            }
        });
        res.json({ message: 'Interesado asignado correctamente', data: participante });

    } catch (err: any) {
        console.error(err);
        // Prisma lanza P2002 en lugar de 23505 para violaciones de unique
        if (err.code === 'P2002') {
            return res.status(400).json({ message: 'Este usuario ya tiene ese rol en el proyecto' });
        }
        res.status(500).json({ error: 'Error al asignar interesado' });
    }
});

// Eliminar el rol (soft data)
router.patch('/eliminar/:id_rol', verifyToken, async (req: Request, res: Response) => {
    try {
        const { id_rol } = req.body;
        
        await prisma.rol.update({
            where: {
                id_rol: Number(id_rol)
            },
            data: {
                estatus: "E"
            }
        });

        res.json({ message: 'Rol eliminado correctamente.'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al dar de baja' });
    }
});

export default router;