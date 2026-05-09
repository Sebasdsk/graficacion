import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma'; 
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// Obtener procesos de un proyecto
router.get('/proyecto/:id_proyecto', verifyToken, async (req: any, res: Response) => {
    try {
        const { id_proyecto } = req.params;

        const procesos = await prisma.proceso.findMany({
            where: {
                id_proyecto: Number(id_proyecto)
            },
            include: {
                subproceso: true 
            },
        });

        res.json(procesos);

    } catch (err) {
        console.error("Error en GET /proyecto/:id_proyecto:", err);
        res.status(500).json('Error al obtener la orden de procesos');
    }
});

// Crear proceso
router.post('/crear_proceso', verifyToken, async (req: any, res: Response) => {
    try {
        const { nombre, descripcion, id_proyecto } = req.body;

        const proceso = await prisma.proceso.create({
            data: {
                nombre,
                descripcion,
                id_proyecto: Number(id_proyecto)
            }
        });

        res.json({ proceso: proceso });

    } catch (err) {
        console.error("Error en POST /crear_proceso:", err);
        res.status(500).json('Error al crear proceso');
    }
});

// Actualizar proceso
router.put('/actualizar_proceso/:id_proceso', verifyToken, async (req: any, res: Response) => {
    try {
        const { id_proceso } = req.params;
        const { nombre, descripcion } = req.body;

        const proceso = await prisma.proceso.update({
            where: { id_proceso: Number(id_proceso) },
            data: { nombre, descripcion }
        });

        res.json({ message: "Proceso actualizado", proceso });
    } catch (err) {
        console.error("Error en PUT /actualizar_proceso:", err);
        res.status(500).json('Error al actualizar proceso');
    }
});

// Eliminar proceso
router.patch('/eliminar_proceso/:id_proceso', verifyToken, async (req: any, res: Response) => {
    try {
        const { id_proceso } = req.params;

        await prisma.proceso.delete({
            where: { id_proceso: Number(id_proceso) }
        });

        res.json({ message: "Proceso eliminado físicamente" });
    } catch (err) {
        console.error("Error en PATCH /eliminar_proceso:", err);
        res.status(500).json('Error al eliminar proceso');
    }
});

// Crear un subproceso como parte de un proceso
router.post('/subproceso', verifyToken, async (req: any, res: Response) => {
    try {
        const { nombre, descripcion, id_proceso } = req.body;

        const subproceso = await prisma.subproceso.create({
            data: {
                nombre: nombre,
                descripcion: descripcion,
                id_proceso: Number(id_proceso)
            }
        });

        res.json({ subproceso: subproceso });

    } catch (err) {
        console.error("Error en POST /subproceso:", err);
        res.status(500).json('Error al crear subproceso');
    }
});

// Actualizar subproceso
router.put('/subproceso/actualizar/:id_subproceso', verifyToken, async (req: any, res: Response) => {
    try {
        const { id_subproceso } = req.params;
        const { nombre, descripcion } = req.body;

        const subproceso = await prisma.subproceso.update({
            where: { id_subproceso: Number(id_subproceso) },
            data: { nombre, descripcion }
        });

        res.json({ message: "Subproceso actualizado", subproceso });
    } catch (err) {
        console.error("Error en PUT /subproceso/actualizar:", err);
        res.status(500).json('Error al actualizar subproceso');
    }
});

// Eliminar subproceso 
router.put('/subproceso/eliminar/:id_subproceso', verifyToken, async (req: any, res: Response) => {
    try {
        const { id_subproceso } = req.params;

        await prisma.subproceso.delete({
            where: { id_subproceso: Number(id_subproceso) }
        });

        res.json({ message: "Subproceso eliminado físicamente" });
    } catch (err) {
        console.error("Error en PUT /subproceso/eliminar:", err);
        res.status(500).json('Error al eliminar subproceso');
    }
});

// Método para obtener un subproceso por ID
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

        if (!subproceso) {
            return res.status(404).json({ message: 'Subproceso no encontrado' });
        }

        res.json(subproceso);

    } catch (err) {
        console.error("Error en GET /subproceso/:id_subproceso:", err);
        res.status(500).json('Error al obtener subproceso');
    }
});

export default router;