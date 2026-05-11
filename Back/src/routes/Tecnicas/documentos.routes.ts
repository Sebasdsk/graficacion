import { Router, Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';

const router = Router();

// Crear tecnica de documentos (análisis de documentos)
router.post('/:id_subproceso', async (req: Request, res: Response) => {
  try {
    const { id_subproceso } = req.params;
    const { titulo, descripcion } = req.body;

    // Crea la técnica base
    const tecnicaRecoleccion = await prisma.tecnica_recoleccion.create({
      data: {
        id_tecnica_catalogo: Number(6), // 6 = Documentos
        titulo: titulo,
        descripcion: descripcion,
        id_subproceso: Number(id_subproceso)
      }
    });

    // Crea el analisis de documento en automático
    const analisisDocumento = await prisma.analisis_documento.create({
      data: {
        id_tecnica: Number(tecnicaRecoleccion.id_tecnica),
        nombre_documento: titulo // Por defecto usamos el titulo
      }
    });

    res.status(201).json({ tecnicaRecoleccion, analisisDocumento });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Todos los analisis de documentos
router.get('/', async (req: Request, res: Response) => {
  try {
    const documentos = await prisma.analisis_documento.findMany({
      include: { tecnica_recoleccion: true }
    });
    res.json(documentos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener documento por su id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const documento = await prisma.analisis_documento.findUnique({
      where: { id_analisis_documento: Number(req.params.id) },
      include: { tecnica_recoleccion: true, hallazgo_documento: true, requisito_documento: true }
    });
    if (!documento) return res.status(404).json({ error: 'Documento no encontrado' });
    res.json(documento);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar documento
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre_documento, tipo_documento, fuente, fecha_analisis, estatus, observaciones } = req.body;

    const documento = await prisma.analisis_documento.update({
      where: {
        id_analisis_documento: Number(id)
      },
      data: {
        ...(nombre_documento && { nombre_documento }),
        ...(tipo_documento && { tipo_documento }),
        ...(fuente && { fuente }),
        ...(fecha_analisis && { fecha_analisis: new Date(fecha_analisis) }),
        ...(estatus && { estatus }),
        ...(observaciones && { observaciones })
      }
    });

    res.json(documento);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
