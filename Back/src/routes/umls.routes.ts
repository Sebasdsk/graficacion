import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { verifyToken } from '../middleware/auth.middleware';
import { tipo_diagrama } from '../../generated/prisma/enums';

const router = Router();

// Método para obtener todos los diagramas UML de un proyecto específico
router.get('/proyecto/:id_proyecto', verifyToken, async (req: Request, res: Response) => {
    try {
        const { id_proyecto } = req.params;
        const diagrams = await prisma.diagrama_uml.findMany({
            where: {
                id_proyecto: Number(id_proyecto),
                estatus: 'A'
            }
        });

        res.json(diagrams);
    } catch (error) {
        console.error('Error al obtener los diagrams:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Función para obtener un diagrama UML por su ID
router.get('/:id_diagrama', verifyToken, async (req: Request, res: Response) => {
    const { id_diagrama } = req.params;

    try {
        const diagram = await prisma.diagrama_uml.findUnique({
            where: {
                id_diagrama: Number(id_diagrama)
            }
        });

        if (!diagram) {
            return res.status(404).json({ error: 'Diagrama no encontrado' });
        }

        res.json(diagram);
    } catch (error) {
        console.error('Error al obtener el diagrama:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Método para crear un nuevo diagrama UML
router.post('/crear-diagrama', verifyToken, async (req: Request, res: Response) => {
    const { id_proyecto, nombre, descripcion, tipo } = req.body;

    // Verificar el tipo de diagrama
    const tipoDiagrama = tipo as tipo_diagrama;

    if (!Object.values(tipo_diagrama).includes(tipoDiagrama)) {
        return res.status(400).json({
            error: 'Tipo de diagrama inválido'
        });
    }

    try {
        const newDiagram = await prisma.diagrama_uml.create({
            data: {
                id_proyecto: Number(id_proyecto),
                nombre: nombre,
                descripcion: descripcion,
                tipo_diagrama: tipoDiagrama
            }
        });
        res.status(201).json(newDiagram);
    } catch (error) {
        console.error('Error al crear el diagrama:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Método para actualizar un diagrama UML
router.put('/actualizar_diagrama/:id_diagrama', verifyToken, async (req: Request, res: Response) => {
    const { id_diagrama } = req.params;
    const { nombre, descripcion } = req.body;

    try {
        const updatedDiagram = await prisma.diagrama_uml.update({
            where: {
                id_diagrama: Number(id_diagrama)
            },
            data: {
                nombre: nombre,
                descripcion: descripcion
            }
        });
        res.status(200).json(updatedDiagram);
    } catch (error) {
        console.error('Error al actualizar el diagrama:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Método para eliminar un diagrama UML (soft delete)
router.put('/eliminar_diagrama/:id_diagrama', verifyToken, async (req: Request, res: Response) => {
    const { id_diagrama } = req.params;

    try {
        await prisma.diagrama_uml.update({
            where: {
                id_diagrama: Number(id_diagrama)
            },
            data: {
                estatus: 'E'
            }
        });
        res.status(200).json({ message: "Diagrama eliminado" });
    } catch (error) {
        console.error('Error al eliminar el diagrama:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Este método actualiza el diagrama en si, este método se usa en la interfaz de la elaboraación de diagramas
router.put('/actualizar_uml/:id_diagrama', verifyToken, async (req: Request, res: Response) => {
    const { id_diagrama } = req.params;
    const { diagrama } = req.body;

    try {
        const updatedDiagram = await prisma.diagrama_uml.update({
            where: {
                id_diagrama: Number(id_diagrama)
            },
            data: {
                diagrama: diagrama
            }
        });
        res.status(200).json(updatedDiagram);
    } catch (error) {
        console.error('Error al actualizar el diagrama:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
