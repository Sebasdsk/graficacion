import { Router, Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';

const router = Router();

// Se crea la técnica mas el focus group
router.post('/', async (req: Request, res: Response) => {
  try {
    const { detalle, codigo_orden, id_subproceso, id_stakeholder, id_usuario, fecha, duracion, estatus, tema } = req.body;
 
    const resultado = await prisma.$transaction(async (tx) => {
      const tecnica = await tx.tecnica_recoleccion.create({
        data: {
          tipo: 'Focus Group',
          detalle: detalle ?? null,
          codigo_orden,
          id_subproceso,
          id_stakeholder: id_stakeholder ?? null
        }
      });
 
      const focusGroup = await tx.focus_group.create({
        data: {
          id_tecnica: tecnica.id_tecnica,
          id_usuario,
          fecha: fecha ? new Date(fecha) : null,
          duracion: duracion ?? null,
          estatus: estatus ?? 'Planificada',
          tema,
          idea: null,
          conclusiones: null
        }
      });
 
      return { tecnica, focusGroup };
    });
 
    res.status(201).json(resultado);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Todos los focus groups
router.get('/', async (req: Request, res: Response) => {
  try {
    const focusGroups = await prisma.focus_group.findMany({
      include: { tecnica: true }
    });
    res.json(focusGroups);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Por ID con participantes
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const focusGroup = await prisma.focus_group.findUnique({
      where: { id_focus: Number(req.params.id) },
      include: {
        tecnica: true,
        participantes: { include: { stakeholder: true } }
      }
    });
    if (!focusGroup) return res.status(404).json({ error: 'Focus Group no encontrado' });
    res.json(focusGroup);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar focus group
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { fecha, duracion, estatus, tema, idea, conclusiones } = req.body;
    const focusGroup = await prisma.focus_group.update({
      where: { id_focus: Number(req.params.id) },
      data: {
        ...(fecha && { fecha: new Date(fecha) }),
        ...(duracion !== undefined && { duracion }),
        ...(estatus && { estatus }),
        ...(tema && { tema }),
        ...(idea && { idea }),
        ...(conclusiones && { conclusiones })
      }
    });
    res.json(focusGroup);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar focus group y su tecnica de recoleccion
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id_focus = Number(req.params.id);
    const focusGroupExistente = await prisma.focus_group.findUnique({
      where: { id_focus }
    });

    if (!focusGroupExistente) {
      return res.status(404).json({ error: 'Focus Group no encontrado' });
    }

    await prisma.$transaction(async (tx: any) => {
      await tx.focus_group.delete({
        where: { id_focus }
      });

      await tx.tecnica_recoleccion.delete({
        where: { id_tecnica: focusGroupExistente.id_tecnica }
      });
    });

    res.json({ message: 'Focus Group y técnica eliminados correctamente' });
  } catch (error: any) {
    console.error("Error al eliminar focus group:", error);
    res.status(500).json({ error: error.message });
  }
});

// ---- participantes del focus group 

// Participantes de un focus group
router.get('/:id_focus/participantes', async (req: Request, res: Response) => {
  try {
    const participantes = await prisma.participante_focus_group.findMany({
      where: { id_focus: Number(req.params.id_focus) },
      include: { stakeholder: true }
    });
    res.json(participantes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar participante
router.post('/:id_focus/participantes', async (req: Request, res: Response) => {
  try {
    const { id_stakeholder, contribuciones } = req.body;
    const participante = await prisma.participante_focus_group.create({
      data: {
        id_focus: Number(req.params.id_focus),
        id_stakeholder,
        contribuciones: contribuciones ?? null
      }
    });
    res.status(201).json(participante);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar contribuciones de un participante
router.patch('/participantes/:id_participante', async (req: Request, res: Response) => {
  try {
    const { contribuciones } = req.body;
    const participante = await prisma.participante_focus_group.update({
      where: { id_participante: Number(req.params.id_participante) },
      data: { contribuciones }
    });
    res.json(participante);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar participante
router.delete('/participantes/:id_participante', async (req: Request, res: Response) => {
  try {
    await prisma.participante_focus_group.delete({
      where: { id_participante: Number(req.params.id_participante) }
    });
    res.json({ message: 'Participante eliminado' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;