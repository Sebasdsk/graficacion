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
                subproceso: { 
                    orderBy: {
                        codigo_orden: 'asc'
                    }
                }
            },
            orderBy: {
                codigo_orden: 'asc'
            }
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

        // Creamos el registro con el nuevo orden
        const proceso = await prisma.proceso.create({
            data: {
                nombre,
                descripcion,
                id_proyecto: Number(id_proyecto),
            }
        });

        res.json({ proceso: proceso });

    } catch (err) {
        console.error("Error en POST /crear_proceso:", err);
        res.status(500).json('Error al crear proceso');
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
                id_proceso: Number(id_proceso),
                codigo_orden: "",
            }
        });

        res.json({ subproceso: subproceso });

    } catch (err) {
        console.error("Error en POST /subproceso:", err);
        res.status(500).json('Error al crear subproceso');
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