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
        const { id_proyecto: id_proyecto_param } = req.params;
        const id_proyecto = parseInt(id_proyecto_param as string);
        const participantes = await prisma.proyecto_participante.findMany({
            where: {
                id_proyecto,
                activo: true
            },
            select: {
                id_participacion: true,
                fecha_asignacion: true,
                usuario: { select: { nombre: true } },
                rol: { select: { nombre: true } }
            }
        });

        // Aplanar el resultado para mantener la misma estructura que antes
        const result = participantes.map((p: any) => ({
            id_participacion: p.id_participacion,
            nombre_usuario: p.usuario.nombre,
            nombre_rol: p.rol.nombre,
            fecha_asignacion: p.fecha_asignacion
        }));

        res.json(result);
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

        const rol = await prisma.rol.create({
            data: { nombre }
        });
        res.json(rol);
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

// Eliminar interesado del proyecto
router.patch('/eliminar/:id_participacion', verifyToken, async (req: Request, res: Response) => {
    try {
        const { id_participacion: id_participacion_param } = req.params;
        const id_participacion = parseInt(id_participacion_param as string);

        const participante = await prisma.proyecto_participante.update({
            where: { id_participacion },
            data: {
                activo: false,
                fecha_salida: new Date()
            }
        });

        res.json({
            message: 'Interesado marcado como baja',
            data: participante
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al dar de baja' });
    }
});

export default router;