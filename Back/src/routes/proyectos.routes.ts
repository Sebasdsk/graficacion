import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from "../../lib/prisma";
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// Endpoint para las estadisticas de proyectos de usuarios
router.get('/estadisticas', verifyToken, async (req: any, res: Response) => {
  try {
    const id_usuario = req.usuario.id; 

    const [total, en_progreso, completados, planificación, cancelados] = await Promise.all([
        prisma.proyecto.count({
            where: { id_usuario_creador: id_usuario }
        }),
        prisma.proyecto.count({
            where: { id_usuario_creador: id_usuario, estatus: 'En Progreso' }
        }),
        prisma.proyecto.count({
            where: { id_usuario_creador: id_usuario, estatus: 'Completado' }
        }),
        prisma.proyecto.count({
            where: { id_usuario_creador: id_usuario, estatus: 'Planificación' }
        }),
        prisma.proyecto.count({
            where: { id_usuario_creador: id_usuario, estatus: 'Cancelado' }
        })
    ]);

    res.json({ total, en_progreso, completados, planificación, cancelados });

  } catch (err) {
    console.error("Error en /estadisticas:", err);
    res.status(500).json('Error al obtener estadisticas');
  }
});

// Endpoint para la lista de proyectos
router.get('/lista', verifyToken, async (req: any, res: Response) => { 
  try {
    const id_usuario = req.usuario.id; 

    const proyectosDb = await prisma.proyecto.findMany({
        where: {
            id_usuario_creador: id_usuario
        },
        orderBy: {
            id_proyecto: 'desc'
        },
        include: {
            _count: {
                select: {
                    proceso: true,
                    proyecto_participante: true 
                }
            }
        }
    });

    const proyectos = proyectosDb.map((p: any) => ({
      id_proyecto: p.id_proyecto,
      nombre: p.nombre,
      descripcion: p.descripcion,
      estatus: p.estatus,
      fecha_inicio: p.fecha_inicio ? new Date(p.fecha_inicio).toISOString().split('T')[0] : null,
      num_procesos: p._count.proceso,
      num_colaboradores: p._count.proyecto_participante
    }));

    res.json(proyectos);

  } catch (err) {
    console.error("Error en /lista:", err);
    res.status(500).json('Error al obtener proyectos');
  }
});

// Endpoint para crear proyecto
router.post('/crear_proyecto', verifyToken, async (req: any, res: Response): Promise<any> => {
  try {
    const { nombre, descripcion, fecha_inicio, id_usuario_po, id_usuario_tl } = req.body;
    const id_usuario_creador = req.usuario.id; 

    if (!id_usuario_po || !id_usuario_tl) {
        return res.status(400).json({ message: 'Falta asignar al Product Owner y/o Tech Lead iniciales' });
    }

    const nuevoProyecto = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const rolPO = await tx.rol.findFirst({ where: { nombre: 'Product Owner' } });
        const rolTL = await tx.rol.findFirst({ where: { nombre: 'Tech Lead' } });

        if (!rolPO || !rolTL) {
            throw new Error('Roles no encontrados en la base de datos');
        }

        // Creamos el proyecto
        const proyecto = await tx.proyecto.create({
            data: {
                nombre,
                descripcion,
                fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : null,
                id_usuario_creador: id_usuario_creador,
                estatus: 'Planificación'
            }
        });

        await tx.proyecto_participante.createMany({
            data: [
                {
                    id_proyecto: proyecto.id_proyecto,
                    id_usuario: id_usuario_po,
                    id_rol: rolPO.id_rol,
                    activo: true
                },
                {
                    id_proyecto: proyecto.id_proyecto,
                    id_usuario: id_usuario_tl,
                    id_rol: rolTL.id_rol,
                    activo: true
                }
            ]
        });

        return proyecto;
    });

    res.json({ message: 'Proyecto creado y equipo inicial asignado', project: nuevoProyecto });

  } catch (err) {
    console.error("Error en /crear_proyecto:", err);
    res.status(500).json('Error al crear proyecto. Verifica que los roles existan en la BD.');
  } 
});

// Endpoint para ver un proyecto
router.get('/ver/:id', verifyToken, async (req: any, res: Response): Promise<any> => { 
    try {
        const { id } = req.params;
        const id_usuario = req.usuario.id;

        const proyecto = await prisma.proyecto.findFirst({
            where: {
                id_proyecto: Number(id),
                id_usuario_creador: id_usuario
            }
        });

        if (!proyecto) {
            return res.status(404).json({ message: 'Proyecto no encontrado o no tienes permiso' });
        }
        res.json(proyecto);

    } catch (err) {
        console.error("Error en /ver/:id:", err);
        res.status(500).json('Error al ver proyecto');
    }
});

// Actualizar un proyecto
router.put('/actualizar/:id', verifyToken, async (req: any, res: Response): Promise<any> => { 
  try {
    const { id } = req.params;
    const id_usuario = req.usuario.id;
    const { nombre, descripcion, fecha_fin, estatus, problema_a_resolver } = req.body;

    // Se verifica que exista y pertenezca al usuario
    const proyectoExistente = await prisma.proyecto.findFirst({
        where: { id_proyecto: Number(id), id_usuario_creador: id_usuario }
    });

    if (!proyectoExistente) {
        return res.status(404).json({ message: 'No se pudo actualizar (No existe o no eres el dueño)' });
    }

    // Si existe, lo actualizamos usando su ID único
    const proyectoActualizado = await prisma.proyecto.update({
        where: { id_proyecto: Number(id) },
        data: {
            nombre,
            descripcion,
            fecha_fin: fecha_fin ? new Date(fecha_fin) : null,
            estatus,
            problema_a_resolver
        }
    });
    
    res.json(proyectoActualizado);

  } catch (err) {
    console.error("Error en /actualizar/:id:", err);
    res.status(500).json('Error actualizando proyecto');
  }
});

// Endpoint para marcar como proyecto "cancelado"
router.patch('/:id/cancelar', verifyToken, async (req: any, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const id_usuario = req.usuario.id; 

        const proyectoExistente = await prisma.proyecto.findFirst({
            where: { id_proyecto: Number(id), id_usuario_creador: id_usuario }
        });

        if (!proyectoExistente) {
            return res.status(404).json({ message: 'No se pudo cancelar ya que no existe o no eres dueño de este' });
        }

        const proyectoCancelado = await prisma.proyecto.update({
            where: { id_proyecto: Number(id) },
            data: { estatus: 'Cancelado' }
        });

        res.json({ message: 'Proyecto cancelado', proyecto: proyectoCancelado });

    } catch (err) {
        console.error("Error en /:id/cancelar:", err);
        res.status(500).json('Error al cancelar proyecto');
    }
});

// Endpoint para listar usuarios disponibles
router.get('/lista-usuarios', verifyToken, async (req: Request, res: Response) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id_usuario: true,
                nombre: true,
                apellido_paterno: true,
                apellido_materno: true,
                email: true
            },
            orderBy: {
                nombre: 'asc'
            }
        });
        
        res.json(usuarios);

    } catch (err) {
        console.error("Error en /lista-usuarios:", err);
        res.status(500).json({ error: 'Error al obtener el catalogo de usuarios' });
    }
});

export default router;