import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

const router = Router();

// Todas las tecnicas de un subproceso
router.get('/subproceso/:id_subproceso', async (req: Request, res: Response) => {
  try {
    const tecnicas = await prisma.tecnica_recoleccion.findMany({
      where: { id_subproceso: Number(req.params.id_subproceso) },
    });
    res.json(tecnicas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Una tecnica por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const tecnica = await prisma.tecnica_recoleccion.findUnique({
      where: { id_tecnica: Number(req.params.id) },
      include: {
        entrevista: true,
        observacion: true
      }
    });
    if (!tecnica) return res.status(404).json({ error: 'Tecnica no encontrada' });
    res.json(tecnica);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Elimina la tecnica especifica en cascada 
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.tecnica_recoleccion.delete({
      where: { id_tecnica: Number(req.params.id) }
    });
    res.json({ message: 'Tecnica eliminada' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;