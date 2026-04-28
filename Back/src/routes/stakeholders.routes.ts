import { Router, Request, Response } from 'express';
import prisma from '../config/db';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// Método para obtener todos los stakeholders relacionados a un rol
router.get('/lista-stakeholders/:id_rol', verifyToken, async(req: Request, res: Response) => {
    const { id_rol } = req.params;

    if (!id_rol) {
        res.status(400).json({ message: "No se proporcionó el id del rol" })
    }

    try {
        const stakeholders = await prisma.stakeholder.findMany({
            where: {
                id_rol: Number(id_rol)
            }
        });

        res.json(stakeholders);
    } catch (err) {
        console.error(err);
        res.status(500).json({Message: "No se pudo obtener el stakeholder", err});
    }
});

// Método que crea un nuevo stakeholder
router.post('/crear-stakeholder', verifyToken, async(req: Request, res: Response) => {
    const { nombre, correo, id_rol } = req.body;

    if (!nombre || !correo) {
        res.status(400).json({ message: "El nombre o el correo no fueron proporcionados" });
    }

    try {
        const stakeholder = await prisma.stakeholder.create({
            data: {
                nombre: nombre,
                contacto_email: correo,
                id_rol: Number(id_rol)
            }
        });

        res.status(200).json({ message: "¡Stakeholder creado correctamente!", stakeholder })
    } catch (err) {
        console.error(err);
        res.status(500).json({Message: "No dse pudo crear el nuevo stakeholder", err});
    }
});

export default router;