import { Router, Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';
import { Prisma } from '@prisma/client';

const router = Router();
 
// Crear tecnica de observacion
router.post('/', async (req: Request, res: Response) => {
  try {
    const { detalle, codigo_orden, id_subproceso, id_stakeholder, id_usuario, fecha, nota, tipo_observacion, tipo_hallazgo, impacto } = req.body;
 
    const resultado = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const tecnica = await tx.tecnica_recoleccion.create({
        data: {
          tipo: 'Observacion',
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
          fecha: fecha ? new Date(fecha) : null,
          nota,
          tipo_observacion,
          tipo_hallazgo: tipo_hallazgo ?? null,
          impacto: impacto ?? null
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
 
export default router;