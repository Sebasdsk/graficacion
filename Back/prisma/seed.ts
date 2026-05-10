import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import dotenv from "dotenv";
import "dotenv/config";

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {

  console.log("iniciando insercion de datos de prueba");

  // ---- USUARIOS ----
  const usuario = await prisma.usuario.upsert({
    where: { id_usuario: 1 },
    update: {},
    create: {
      id_usuario: 1,
      nombre: "Carlos",
      apellido_paterno: "Bojorquez",
      apellido_materno: "Apodaca",
      email: "carlosbojorquez1326@gmail.com",
      password_hash: "A12345678",
      Nombre_usuario: "CarlosB",
      estatus: "A"
    }
  });


  console.log(" Usuarios creados");

  // ---- ROLES ----
  const rolPO = await prisma.rol.upsert({
    where: { id_rol: 1 },
    update: {},
    create: {
      id_rol: 1,
      nombre: "Product Owner",
      estatus: "A"
    }
  });

  const rolTL = await prisma.rol.upsert({
    where: { id_rol: 2 },
    update: {},
    create: {
      id_rol: 2,
      nombre: "Tech Lead",
      estatus: "A"
    }
  });

  console.log(" Roles creados");

  // ---- STAKEHOLDERS ----
  const stakeholder1 = await prisma.stakeholder.upsert({
    where: { id_stakeholder: 1 },
    update: {},
    create: {
      id_stakeholder: 1,
      nombre: "Luis Angel",
      area: "Informatica",
      contacto_email: "Lewisangelo11@gmail.com",
      id_rol: rolPO.id_rol,
      estatus: "A"
    }
  });

  const stakeholder2 = await prisma.stakeholder.upsert({
    where: { id_stakeholder: 2 },
    update: {},
    create: {
      id_stakeholder: 2,
      nombre: "Pito Perez",
      area: "Ventas",
      contacto_email: "pitoperez1326@gmail.com",
      id_rol: rolTL.id_rol,
      estatus: "A"
    }
  });

  console.log("Stakeholders creados");

  // ---- PROYECTO ----
  const proyecto = await prisma.proyecto.upsert({
    where: { id_proyecto: 1 },
    update: {},
    create: {
      id_proyecto: 1,
      nombre: "Administratum",
      descripcion: "division administrativa y burocratica",
      problema_a_resolver: "El proceso actual es manual y genera errores",
      fecha_inicio: new Date("2026-05-10"),
      estatus: "En Progreso",
      id_usuario_creador: usuario.id_usuario
    }
  });

  console.log("Proyecto creado");

  // ---- PROCESO ----
  const proceso = await prisma.proceso.upsert({
    where: { id_proceso: 1 },
    update: {},
    create: {
      id_proceso: 1,
      nombre: "Proceso 1",
      descripcion: "poz para pruebas jaja",
      id_proyecto: proyecto.id_proyecto
    }
  });

  console.log("Proceso creado");

  // ---- SUBPROCESOS ----
  const subproceso1 = await prisma.subproceso.upsert({
    where: { id_subproceso: 1 },
    update: {},
    create: {
      id_subproceso: 1,
      nombre: "Subproceso 1",
      descripcion: "poz para pruebas jaja",
      id_proceso: proceso.id_proceso
    }
  });

  const subproceso2 = await prisma.subproceso.upsert({
    where: { id_subproceso: 2 },
    update: {},
    create: {
      id_subproceso: 2,
      nombre: "Subproceso 2",
      descripcion: "poz para pruebas jaja v2",
      id_proceso: proceso.id_proceso
    }
  });

  console.log("Subprocesos creados");

  // ---- TÉCNICAS ----
  const tecnicaEntrevista = await prisma.tecnica_recoleccion.upsert({
    where: { id_tecnica: 1 },
    update: {},
    create: {
      id_tecnica: 1,
      tipo: "Entrevista",
      codigo_orden: "1.1.1",
      id_subproceso: subproceso1.id_subproceso,
      id_stakeholder: stakeholder1.id_stakeholder
    }
  });

  const tecnicaCuestionario = await prisma.tecnica_recoleccion.upsert({
    where: { id_tecnica: 2 },
    update: {},
    create: {
      id_tecnica: 2,
      tipo: "Cuestionario",
      codigo_orden: "1.1.2",
      id_subproceso: subproceso1.id_subproceso,
      id_stakeholder: stakeholder2.id_stakeholder
    }
  });

  const tecnicaFocusGroup = await prisma.tecnica_recoleccion.upsert({
    where: { id_tecnica: 3 },
    update: {},
    create: {
      id_tecnica: 3,
      tipo: "Focus Group",
      codigo_orden: "1.2.1",
      id_subproceso: subproceso2.id_subproceso
    }
  });

  const tecnicaObservacion = await prisma.tecnica_recoleccion.upsert({
    where: { id_tecnica: 4 },
    update: {},
    create: {
      id_tecnica: 4,
      tipo: "Observación",
      codigo_orden: "1.2.2",
      id_subproceso: subproceso2.id_subproceso,
      id_stakeholder: stakeholder1.id_stakeholder
    }
  });

  console.log("Técnicas creadas");

  // ---- ENTREVISTA ----
  await prisma.entrevista.upsert({
    where: { id_entrevista: 1 },
    update: {},
    create: {
      id_entrevista: 1,
      id_tecnica: tecnicaEntrevista.id_tecnica,
      id_usuario: usuario.id_usuario,
      fecha_entrevista: new Date("2026-05-10"),
      duracion: 45,
      estatus: "Realizada"
    }
  });

  await prisma.pregunta_entrevista.upsert({
    where: { id_pregunta: 1 },
    update: {},
    create: {
      id_pregunta: 1,
      id_entrevista: 1,
      orden_pregunta: 1,
      pregunta: "¿hola?",
      respuesta: "respuesta 1 jeje"
    }
  });

  await prisma.pregunta_entrevista.upsert({
    where: { id_pregunta: 2 },
    update: {},
    create: {
      id_pregunta: 2,
      id_entrevista: 1,
      orden_pregunta: 2,
      pregunta: "¿hola 2?",
      respuesta: null
    }
  });

  console.log("Entrevista y preguntas creadas");

  // ---- CUESTIONARIO ----
  await prisma.cuestionario.upsert({
    where: { id_cuestionario: 1 },
    update: {},
    create: {
      id_cuestionario: 1,
      id_tecnica: tecnicaCuestionario.id_tecnica,
      id_usuario: usuario.id_usuario,
      fecha: new Date("2026-05-10"),
      estatus: "Pendiente"
    }
  });

  await prisma.pregunta_cuestionario.upsert({
    where: { id_pregunta: 1 },
    update: {},
    create: {
      id_pregunta: 1,
      id_cuestionario: 1,
      orden_pregunta: 1,
      tipo_pregunta: "multiple",
      pregunta: "¿hola 3?",
      respuesta: null
    }
  });

  await prisma.pregunta_cuestionario.upsert({
    where: { id_pregunta: 2 },
    update: {},
    create: {
      id_pregunta: 2,
      id_cuestionario: 1,
      orden_pregunta: 2,
      tipo_pregunta: "escala",
      pregunta: "¿La vida imita al arte o el arte imita a la vida?",
      respuesta: null
    }
  });

  console.log("Cuestionario y preguntas creadas");

  // ---- FOCUS GROUP ----
  await prisma.focus_group.upsert({
    where: { id_focus: 1 },
    update: {},
    create: {
      id_focus: 1,
      id_tecnica: tecnicaFocusGroup.id_tecnica,
      id_usuario: usuario.id_usuario,
      fecha: new Date("2026-05-10"),
      duracion: 90,
      estatus: "Planificada",
      tema: "¿China atacara Taiwan en 2027 o nel?"
    }
  });

  await prisma.participante_focus_group.upsert({
    where: { id_participante: 1 },
    update: {},
    create: {
      id_participante: 1,
      id_focus: 1,
      id_stakeholder: stakeholder1.id_stakeholder,
      contribuciones: null
    }
  });

  await prisma.participante_focus_group.upsert({
    where: { id_participante: 2 },
    update: {},
    create: {
      id_participante: 2,
      id_focus: 1,
      id_stakeholder: stakeholder2.id_stakeholder,
      contribuciones: null
    }
  });

  console.log("Focus Group y participantes creados");

  // ---- OBSERVACION ----
  await prisma.observacion.upsert({
    where: { id_observacion: 1 },
    update: {},
    create: {
      id_observacion: 1,
      id_tecnica: tecnicaObservacion.id_tecnica,
      id_usuario: usuario.id_usuario,
      fecha: new Date("2026-05-10"),
      nota: "China fracasara en la invasion de Taiwan",
      tipo_observacion: "comportamiento",
      tipo_hallazgo: "problema",
      impacto: "alto"
    }
  });

  console.log("Observacion creada");
  console.log("insercion completado exitosamente");
}

main()
  .catch((e) => {
    console.error("Error en la insercion:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });