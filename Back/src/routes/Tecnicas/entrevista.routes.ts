import { Router, Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Obtener todas las entrevistas
router.get('/', async (req: Request, res: Response) => {
  try {
    const entrevistas = await prisma.entrevista.findMany();
    res.json(entrevistas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const entrevista = await prisma.entrevista.findUnique({
      where: { id_entrevista: Number(req.params.id) }
    });
    if (!entrevista) return res.status(404).json({ error: 'Entrevista no encontrada' });
    res.json(entrevista);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Crear entrevista
router.post('/crear_entrevista', async (req: Request, res: Response) => {
  try {
    const { id_tecnica, id_usuario, fecha_entrevista, duracion, estatus } = req.body;
    const entrevista = await prisma.entrevista.create({
      data: {
        id_tecnica,
        id_usuario,
        fecha_entrevista: fecha_entrevista ? new Date(fecha_entrevista) : null,
        duracion: duracion ?? null,
        estatus: estatus ?? 'Pendiente'
      }
    });
    res.status(201).json(entrevista);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar entrevista
router.put('/actualizar_entrevista/:id', async (req: Request, res: Response) => {
  try {
    const { fecha_entrevista, duracion, estatus } = req.body;
    const entrevista = await prisma.entrevista.update({
      where: { id_entrevista: Number(req.params.id) },
      data: { // Se usa el operador spread para solo enviar los campos del body
        ...(fecha_entrevista && { fecha_entrevista: new Date(fecha_entrevista) }),
        ...(duracion !== undefined && { duracion }),
        ...(estatus && { estatus })
      }
    });
    res.json(entrevista);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar entrevista
router.delete('/eliminar_entrevista/:id', async (req: Request, res: Response) => {
  try {
    await prisma.entrevista.delete({
      where: { id_entrevista: Number(req.params.id) }
    });
    res.json({ message: 'Entrevista eliminada' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;