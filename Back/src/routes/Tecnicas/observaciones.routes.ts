import { Router, Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Obtener todas las observaciones
router.get('/', async (req: Request, res: Response) => {
  try {
    const observaciones = await prisma.observacion.findMany();
    res.json(observaciones);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const observacion = await prisma.observacion.findUnique({
      where: { id_observacion: Number(req.params.id) }
    });
    if (!observacion) return res.status(404).json({ error: 'Observación no encontrada' });
    res.json(observacion);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Crear observacion
router.post('/crear_observacion', async (req: Request, res: Response) => {
  try {
    const { id_tecnica, id_usuario, fecha, nota, tipo_observacion, tipo_hallazgo, impacto } = req.body;
    const observacion = await prisma.observacion.create({
      data: {
        id_tecnica,
        id_usuario,
        fecha: fecha ? new Date(fecha) : null,
        nota,
        tipo_observacion,
        tipo_hallazgo: tipo_hallazgo ?? null,
        impacto: impacto ?? null
      }
    });
    res.status(201).json(observacion);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar observacion
router.put('/actualizar_observacion/:id', async (req: Request, res: Response) => {
  try {
    const { fecha, nota, tipo_observacion, tipo_hallazgo, impacto } = req.body;
    const observacion = await prisma.observacion.update({
      where: { id_observacion: Number(req.params.id) },
      data: {
        ...(fecha && { fecha: new Date(fecha) }),
        ...(nota && { nota }),
        ...(tipo_observacion && { tipo_observacion }),
        ...(tipo_hallazgo && { tipo_hallazgo }),
        ...(impacto && { impacto })
      }
    });
    res.json(observacion);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar observacion
router.delete('/eliminar_observacion/:id', async (req: Request, res: Response) => {
  try {
    await prisma.observacion.delete({
      where: { id_observacion: Number(req.params.id) }
    });
    res.json({ message: 'Observación eliminada' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;