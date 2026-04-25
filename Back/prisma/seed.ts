import { PrismaClient } from '../src/generated/prisma/client'
const prisma = new PrismaClient()
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  console.log('Introduciendo datos de prueba')

  // Crear Usuario Creador
  const usuario = await prisma.usuario.upsert({
    where: { id_usuario: 1 },
    update: {},
    create: {
      id_usuario: 1,
      nombre: 'Carlos',
      apellido_paterno: 'Bojorquez',
      apellido_materno: 'Apodaca',
      email: 'carlosbojorquez1326@gmail.com',
      Nombre_usuario: 'CarlosB',
      password_hash: '12345678',
      estatus: 'A'
    },
  })

  // Crear Proyecto 
  const proyecto = await prisma.proyecto.create({
    data: {
      nombre: 'Administratum',
      descripcion: 'Para pruebas',
      problema_a_resolver: 'poz probar cosas jaja',
      fecha_inicio: new Date('2026-04-24'),
      estatus: 'Planificación',
      id_usuario_creador: usuario.id_usuario
    }
  })

  // Crear Rol 
  const rol = await prisma.rol.create({
    data: {
      nombre: 'Product Owner',
      descripcion: 'Jefazo',
      estatus: 'A',
      id_proyecto: proyecto.id_proyecto
    }
  })

  // Crear Proceso 
  const proceso = await prisma.proceso.create({
    data: {
      nombre: 'Proceso de prueba v1',
      descripcion: 'v1',
      codigo_orden: 'P-01',
      id_proyecto: proyecto.id_proyecto
    }
  })

  // Crear Subproceso 
  const subproceso = await prisma.subproceso.create({
    data: {
      nombre: 'Entrevistar usuarios',
      descripcion: 'Conversacion directa',
      codigo_orden: 'Sp-01.1',
      id_proceso: proceso.id_proceso
    }
  })

  //  Crear Stakeholder 
  const stakeholder = await prisma.stakeholder.create({
    data: {
      nombre: 'Ing. Luis Angel',
      area: 'Desarrollador',
      contacto_email: 'LuisAngel@gmail.com',
      id_rol: rol.id_rol, 
      notas: 'Stakeholder principal del proyecto'
    }
  })

  // Crear Técnica de Recolección
  const tecnica = await prisma.tecnica_recoleccion.create({
    data: {
      tipo: 'Entrevista',
      detalle: 'Preguntas abiertas sobre el flujo del sistema',
      codigo_orden: 'T-01',
      id_subproceso: subproceso.id_subproceso,
      id_stakeholder: stakeholder.id_stakeholder
    }
  })

  console.log('Finish')
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })