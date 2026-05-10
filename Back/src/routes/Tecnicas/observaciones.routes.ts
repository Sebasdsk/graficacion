import { Router, Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';

const router = Router();
 
// Crear tecnica de observacion
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      detalle, codigo_orden, id_subproceso, id_stakeholder, id_usuario,
      ubicacion, fecha, duracion, estatus
    } = req.body;
 
    const resultado = await prisma.$transaction(async (tx) => {
      const tecnica = await tx.tecnica_recoleccion.create({
        data: {
          tipo: 'Observación',
          detalle: detalle ?? null,
          codigo_orden,
          id_subproceso,
          id_stakeholder: id_stakeholder ?? null
        }
      });
 
      const observacion = await tx.observacion.create({
        data: {
          id_tecnica: tecnica.id_tecnica,
          id_usuario,
          id_stakeholder: id_stakeholder ?? null,
          ubicacion: ubicacion ?? null,
          fecha: fecha ? new Date(fecha) : null,
          duracion: duracion ?? null,
          estatus: estatus ?? 'Planificada',
          nota: null,
          hallazgos_conclusiones: null
        }
      });
 
      return { tecnica, observacion };
    });
 
    res.status(201).json(resultado);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
 
// Todas las observaciones
router.get('/', async (req: Request, res: Response) => {
  try {
    const observaciones = await prisma.observacion.findMany({
      include: { tecnica_recoleccion: true }
    });
    res.json(observaciones);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
 
// Por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const observacion = await prisma.observacion.findUnique({
      where: { id_observacion: Number(req.params.id) },
      include: {
        tecnica_recoleccion: true,
        stakeholder: true
      }
    });
    if (!observacion) return res.status(404).json({ error: 'Observación no encontrada' });
    res.json(observacion);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
 
// Actualizar observacion
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { ubicacion, fecha, duracion, estatus, notas, hallazgos_conclusiones } = req.body;
    const observacion = await prisma.observacion.update({
      where: { id_observacion: Number(req.params.id) },
      data: {
        ...(ubicacion && { ubicacion }),
        ...(fecha && { fecha: new Date(fecha) }),
        ...(duracion !== undefined && { duracion }),
        ...(estatus && { estatus }),
        ...(notas && { notas }),
        ...(hallazgos_conclusiones && { hallazgos_conclusiones })
      }
    });
    res.json(observacion);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar observacion y su tecnica de recolección
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id_observacion = Number(req.params.id);
    const observacionExistente = await prisma.observacion.findUnique({
      where: { id_observacion }
    });

    if (!observacionExistente) {
      return res.status(404).json({ error: 'Observación no encontrada' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.observacion.delete({
        where: { id_observacion }
      });

      await tx.tecnica_recoleccion.delete({
        where: { id_tecnica: observacionExistente.id_tecnica }
      });
    });

    res.json({ message: 'Observacion y tecnica eliminadas correctamente' });
  } catch (error: any) {
    console.error("Error al eliminar observación:", error);
    res.status(500).json({ error: error.message });
  }
});
 
export default router;