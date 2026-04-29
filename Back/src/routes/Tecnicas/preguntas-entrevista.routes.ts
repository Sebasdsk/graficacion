import { Router, Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';

const router = Router();

// Obtener todas las preguntas de una entrevista
router.get('/:id_entrevista/preguntas', async (req: Request, res: Response) => {
  try {
    const preguntas = await prisma.pregunta_entrevista.findMany({
      where: { id_entrevista: Number(req.params.id_entrevista) },
      orderBy: { orden_pregunta: 'asc' }
    });
    res.json(preguntas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar pregunta a una entrevista
router.post('/:id_entrevista/agregar_pregunta', async (req: Request, res: Response) => {
  try {
    const { pregunta, orden_pregunta } = req.body;
    const nueva = await prisma.pregunta_entrevista.create({
      data: {
        id_entrevista: Number(req.params.id_entrevista),
        pregunta,
        orden_pregunta,
        respuesta: null
      }
    });
    res.status(201).json(nueva);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Guardar respuesta de una pregunta
router.patch('/preguntas/:id_pregunta/guardar_respuesta', async (req: Request, res: Response) => {
  try {
    const { respuesta } = req.body;
    const actualizada = await prisma.pregunta_entrevista.update({
      where: { id_pregunta: Number(req.params.id_pregunta) },
      data: { respuesta }
    });
    res.json(actualizada);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Editar pregunta
router.put('/modificar_pregunta/:id_pregunta', async (req: Request, res: Response) => {
  try {
    const { pregunta, orden_pregunta } = req.body;
    const actualizada = await prisma.pregunta_entrevista.update({
      where: { id_pregunta: Number(req.params.id_pregunta) },
      data: { pregunta, orden_pregunta }
    });
    res.json(actualizada);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar pregunta
router.delete('/eliminar_pregunta/:id_pregunta', async (req: Request, res: Response) => {
  try {
    await prisma.pregunta_entrevista.delete({
      where: { id_pregunta: Number(req.params.id_pregunta) }
    });
    res.json({ message: 'Pregunta eliminada' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;