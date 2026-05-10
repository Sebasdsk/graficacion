import { Router, Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';

const router = Router();

// Se crea la tecnica y el cuestionario
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      detalle, codigo_orden, id_subproceso, id_stakeholder, id_usuario,
      objetivo, audiencia_objetivo, responsable, metodo_distribucion,
      fecha_distribucion, fecha_limite, instrucciones, estatus
    } = req.body;
 
    const resultado = await prisma.$transaction(async (tx) => {
      const tecnica = await tx.tecnica_recoleccion.create({
        data: {
          tipo: 'Cuestionario',
          detalle: detalle ?? null,
          codigo_orden,
          id_subproceso,
          id_stakeholder: id_stakeholder ?? null
        }
      });
 
      const cuestionario = await tx.cuestionario.create({
        data: {
          id_tecnica: tecnica.id_tecnica,
          id_usuario,
          objetivo: objetivo ?? null,
          audiencia_objetivo: audiencia_objetivo ?? null,
          responsable: responsable ?? null,
          metodo_distribucion: metodo_distribucion ?? null,
          fecha_distribucion: fecha_distribucion ? new Date(fecha_distribucion) : null,
          fecha_limite: fecha_limite ? new Date(fecha_limite) : null,
          instrucciones: instrucciones ?? null,
          estatus: estatus ?? 'Pendiente'
        }
      });
 
      return { tecnica, cuestionario };
    });
 
    res.status(201).json(resultado);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Todos los cuestionarios
router.get('/', async (req: Request, res: Response) => {
  try {
    const cuestionarios = await prisma.cuestionario.findMany({
      include: { tecnica: true }
    });
    res.json(cuestionarios);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const cuestionario = await prisma.cuestionario.findUnique({
      where: { id_cuestionario: Number(req.params.id) },
      include: { tecnica: true, preguntas: true }
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
    const {
      objetivo, audiencia_objetivo, responsable, metodo_distribucion,
      fecha_distribucion, fecha_limite, respuestas_recibidas, instrucciones, estatus
    } = req.body;
 
    const cuestionario = await prisma.cuestionario.update({
      where: { id_cuestionario: Number(req.params.id) },
      data: {
        ...(objetivo && { objetivo }),
        ...(audiencia_objetivo && { audiencia_objetivo }),
        ...(responsable && { responsable }),
        ...(metodo_distribucion && { metodo_distribucion }),
        ...(fecha_distribucion && { fecha_distribucion: new Date(fecha_distribucion) }),
        ...(fecha_limite && { fecha_limite: new Date(fecha_limite) }),
        ...(respuestas_recibidas !== undefined && { respuestas_recibidas }),
        ...(instrucciones && { instrucciones }),
        ...(estatus && { estatus })
      }
    });
    res.json(cuestionario);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar cuestionario y su técnica de recolección
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id_cuestionario = Number(req.params.id);
    const cuestionarioExistente = await prisma.cuestionario.findUnique({
      where: { id_cuestionario }
    });

    if (!cuestionarioExistente) {
      return res.status(404).json({ error: 'Cuestionario no encontrado' });
    }

    await prisma.$transaction(async (tx: any) => {
      await tx.cuestionario.delete({
        where: { id_cuestionario }
      });

      await tx.tecnica_recoleccion.delete({
        where: { id_tecnica: cuestionarioExistente.id_tecnica }
      });
    });

    res.json({ message: 'Cuestionario y tecnica eliminados correctamente' });
  } catch (error: any) {
    console.error("Error al eliminar cuestionario:", error);
    res.status(500).json({ error: error.message });
  }
});

// ------ Preguntas del cuestionario

router.get('/:id_cuestionario/preguntas', async (req: Request, res: Response) => {
  try {
    const preguntas = await prisma.pregunta_cuestionario.findMany({
      where: { id_cuestionario: Number(req.params.id_cuestionario) },
      orderBy: { orden_pregunta: 'asc' }
    });
    res.json(preguntas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar pregunta al cuestionario
router.post('/:id_cuestionario/preguntas', async (req: Request, res: Response) => {
  try {
    const { pregunta, tipo_pregunta, orden_pregunta } = req.body;
    const nueva = await prisma.pregunta_cuestionario.create({
      data: {
        id_cuestionario: Number(req.params.id_cuestionario),
        pregunta,
        tipo_pregunta,
        orden_pregunta,
        respuesta: null
      }
    });
    res.status(201).json(nueva);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar pregunta
router.put('/preguntas/:id_pregunta', async (req: Request, res: Response) => {
  try {
    const { pregunta, tipo_pregunta, orden_pregunta } = req.body;
    const actualizada = await prisma.pregunta_cuestionario.update({
      where: { id_pregunta: Number(req.params.id_pregunta) },
      data: {
        ...(pregunta && { pregunta }),
        ...(tipo_pregunta && { tipo_pregunta }),
        ...(orden_pregunta !== undefined && { orden_pregunta })
      }
    });
    res.json(actualizada);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar respuesta
router.patch('/preguntas/:id_pregunta/respuesta', async (req: Request, res: Response) => {
  try {
    const { respuesta } = req.body;
    const actualizada = await prisma.pregunta_cuestionario.update({
      where: { id_pregunta: Number(req.params.id_pregunta) },
      data: { respuesta }
    });
    res.json(actualizada);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar pregunta
router.delete('/preguntas/:id_pregunta', async (req: Request, res: Response) => {
  try {
    await prisma.pregunta_cuestionario.delete({
      where: { id_pregunta: Number(req.params.id_pregunta) }
    });
    res.json({ message: 'Pregunta eliminada' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;