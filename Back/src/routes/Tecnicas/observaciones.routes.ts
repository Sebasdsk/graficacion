import { Router, Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';

const router = Router();

// Crear tecnica de observacion
router.post('/:id_subproceso', async (req: Request, res: Response) => {
  try {
    const { id_subproceso } = req.params;
    const { titulo, descripcion } = req.body;

    // Crea la técnica base
    const tecnicaRecolecion = await prisma.tecnica_recoleccion.create({
      data: {
        id_tecnica_catalogo: Number(2),
        titulo: titulo,
        descripcion: descripcion,
        id_subproceso: Number(id_subproceso)
      }
    });

    // Crea la observación en autimático
    await prisma.observacion.create({
      data: {
        id_tecnica: Number(tecnicaRecolecion.id_tecnica)
      }
    });

    res.json(tecnicaRecolecion);
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

// Obtener la observación por su id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const observacion = await prisma.observacion.findUnique({
      where: { id_observacion: Number(req.params.id) },
      include: { tecnica_recoleccion: true }
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
    const { id } = req.params;
    const { id_stakeholder, ubicacion, fecha, duracion, hallazgos, observaciones } = req.body;

    const observacion = await prisma.observacion.update({
      where: {
        id_observacion: Number(id)
      },
      data: {
        id_stakeholder: Number(id_stakeholder),
        ubicacion: ubicacion,
        fecha: fecha,
        duracion: duracion,
        hallazgos: hallazgos
      }
    });

    if (observaciones.lenght === 0) {
      res.json({ observacion });
    }

    const observacionesDetalles = await prisma.observacion_detalle.createMany({
      data: {
        id_observacion: Number(observacion.id_observacion),
        hora: observaciones.hora,
        categoria: observaciones.categoria,
        descripcion: observaciones.descripcion
      }
    });

    res.json({ observacion, observacionesDetalles });

  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;