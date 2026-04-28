import { Router, Request, Response } from 'express';
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
        const { nombre, descripcion, fecha_inicio } = req.body;
        const id_usuario_creador = req.usuario.id;

        // Creamos el proyecto
        const proyecto = await prisma.proyecto.create({
            data: {
                nombre,
                descripcion,
                fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : null,
                id_usuario_creador: id_usuario_creador,
                estatus: 'Planificación'
            }
        });

        // Cuerpos para los roles por defecto del nuevo proyecto
        const bodyPO = {
            id_proyecto: proyecto.id_proyecto,
            nombre: "Product Owner",
            descripcion: "Responsable de maximizar el valor de un producto en un equipo ágil.",
            estatus: "A"
        }

        const bodyTL = {
            id_proyecto: proyecto.id_proyecto,
            nombre: "Tech Leader",
            descripcion: "Desarrollador experimentado responsable de guiar la dirección técnica.",
            estatus: "A"
        }

        // Aqui se crean los roles de Product Owner y Tech Leader
        await prisma.rol.createMany({
            data: [ 
                bodyPO,
                bodyTL 
            ]
        });

        res.json({ message: 'Proyecto creado', project: proyecto });
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