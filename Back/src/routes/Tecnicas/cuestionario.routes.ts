import { Router, Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';

const router = Router();

// Crear tecnica de cuestionario
router.post('/:id_subproceso', async (req: Request, res: Response) => {
  try {
    const { id_subproceso } = req.params;
    const { titulo, descripcion } = req.body;

    // Crea la técnica base
    const tecnicaRecoleccion = await prisma.tecnica_recoleccion.create({
      data: {
        id_tecnica_catalogo: Number(2), // 2 = Cuestionario
        titulo: titulo,
        descripcion: descripcion,
        id_subproceso: Number(id_subproceso)
      }
    });

    // Crea el cuestionario en automático
    const cuestionario = await prisma.cuestionario.create({
      data: {
        id_tecnica: Number(tecnicaRecoleccion.id_tecnica)
      }
    });

    res.status(201).json({ tecnicaRecoleccion, cuestionario });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Todas los cuestionarios
router.get('/', async (req: Request, res: Response) => {
  try {
    const cuestionarios = await prisma.cuestionario.findMany({
      include: { tecnica_recoleccion: true }
    });
    res.json(cuestionarios);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener cuestionario por su id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const cuestionario = await prisma.cuestionario.findUnique({
      where: { id_cuestionario: Number(req.params.id) },
      include: { tecnica_recoleccion: true, pregunta_cuestionario: true, respuesta_cuestionario: true }
    });
    if (!cuestionario) return res.status(404).json({ error: 'Cuestionario no encontrado' });
    res.json(cuestionario);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar cuestionario
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { id_stakeholder, objetivo, audiencia_objetivo, responsable, metodo_distribucion, fecha_distribucion, fecha_limite, instrucciones, estatus } = req.body;

    const cuestionario = await prisma.cuestionario.update({
      where: {
        id_cuestionario: Number(id)
      },
      data: {
        ...(id_stakeholder && { id_stakeholder: Number(id_stakeholder) }),
        ...(objetivo && { objetivo }),
        ...(audiencia_objetivo && { audiencia_objetivo }),
        ...(responsable && { responsable }),
        ...(metodo_distribucion && { metodo_distribucion }),
        ...(fecha_distribucion && { fecha_distribucion: new Date(fecha_distribucion) }),
        ...(fecha_limite && { fecha_limite: new Date(fecha_limite) }),
        ...(instrucciones && { instrucciones }),
        ...(estatus && { estatus })
      }
    });

    res.json(cuestionario);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
