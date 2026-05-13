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
        id_tecnica_catalogo: Number(4),
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
      include: {
        tecnica_recoleccion: true,
        respuesta_cuestionario: true,
        pregunta_cuestionario: {
          orderBy: { orden_pregunta: 'asc' },
          include: {
            opcion_respuesta: true,
            detalle_respuesta: true,
          }
        }
      }
    });
    if (!cuestionario) return res.status(404).json({ error: 'Cuestionario no encontrado' });
    res.json(cuestionario);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar cuestionario (info general + preguntas con sus opciones)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      objetivo, audiencia_objetivo, responsable, metodo_distribucion,
      fecha_distribucion, fecha_limite, respuestas_recibidas,
      instrucciones, preguntas, respuestas
    } = req.body;

    // Actualizar información general del cuestionario
    await prisma.cuestionario.update({
      where: { id_cuestionario: Number(id) },
      data: {
        objetivo: objetivo,
        audiencia_objetivo: audiencia_objetivo,
        responsable: responsable,
        metodo_distribucion: metodo_distribucion,
        fecha_distribucion: new Date(fecha_distribucion),
        fecha_limite: new Date(fecha_limite),
        respuestas_recibidas: Number(respuestas_recibidas),
        instrucciones: instrucciones
      }
    });

    // Actualizar preguntas (delete old + create new)
    if (preguntas !== undefined) {
      // Elimina todas las preguntas anteriores (opciones se eliminan en cascada)
      await prisma.pregunta_cuestionario.deleteMany({
        where: { id_cuestionario: Number(id) }
      });

      // Crea las nuevas preguntas con sus opciones
      for (let i = 0; i < preguntas.length; i++) {
        const p = preguntas[i];

        // Mapear tipo del frontend al enum de Prisma
        const tipoPregunta =
          p.tipo === 'Opción Múltiple' ? 'opcion_multiple' :
            p.tipo === 'Escala' ? 'escala' :
              'texto_libre';

        await prisma.pregunta_cuestionario.create({
          data: {
            id_cuestionario: Number(id),
            orden_pregunta: i + 1,
            pregunta: p.textoPregunta,
            tipo_pregunta: tipoPregunta as any,
            ...(p.tipo === 'Escala' && {
              valor_minimo: Number(p.escalaMin),
              valor_maximo: Number(p.escalaMax),
              etiqueta_minima: p.etiquetaMin || null,
              etiqueta_maxima: p.etiquetaMax || null
            }),
            ...(p.tipo === 'Opción Múltiple' && p.opciones?.length > 0 && {
              opcion_respuesta: {
                create: p.opciones.map((op: any) => ({
                  texto_opcion: op.texto
                }))
              }
            })
          }
        });
      }
    }

    // Registrar respuestas
    if (respuestas !== undefined && respuestas.length > 0) {
      // Crear respuesta general
      const nuevaRespuesta = await prisma.respuesta_cuestionario.create({
        data: {
          id_cuestionario: Number(id)
        }
      });
      // Crear detalles
      for (const r of respuestas) {
        await prisma.detalle_respuesta.create({
          data: {
            id_respuesta: nuevaRespuesta.id_respuesta,
            id_pregunta: r.id_pregunta,
            respuesta_texto: r.respuesta_texto || null,
            respuesta_numero: r.respuesta_numero || null,
            id_opcion: r.id_opcion || null
          }
        });
      }
    }

    // Devolver el cuestionario actualizado con todas sus relaciones
    const cuestionarioActualizado = await prisma.cuestionario.findUnique({
      where: { id_cuestionario: Number(id) },
      include: {
        pregunta_cuestionario: {
          orderBy: { orden_pregunta: 'asc' },
          include: {
            opcion_respuesta: true,
            detalle_respuesta: true
          }
        }
      }
    });

    res.json(cuestionarioActualizado);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Método para guardar las respuestas del cuestionario
router.post('/:id/responder', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      respuestas
    } = req.body;

    // Crear respuesta general
    const nuevaRespuesta =
      await prisma.respuesta_cuestionario.create({
        data: {
          id_cuestionario: Number(id)
        }
      });

    // Crear detalles
    for (const r of respuestas) {
      const detalle =await prisma.detalle_respuesta.create({
        data: {
          id_respuesta: nuevaRespuesta.id_respuesta,
          id_pregunta: r.id_pregunta,
          respuesta_texto: r.respuesta_texto || null,
          respuesta_numero: r.respuesta_numero || null,
          id_opcion: r.id_opcion || null
        }
      });
    }
    

    res.json({ message: 'Respuestas registradas' });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
