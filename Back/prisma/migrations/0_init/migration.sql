-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "proceso" (
    "id_proceso" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "id_proyecto" INTEGER,
    "codigo_orden" VARCHAR(10),

    CONSTRAINT "proceso_pkey" PRIMARY KEY ("id_proceso")
);

-- CreateTable
CREATE TABLE "proyecto" (
    "id_proyecto" SERIAL NOT NULL,
    "nombre" VARCHAR(50),
    "descripcion" TEXT,
    "problema_a_resolver" TEXT,
    "fecha_inicio" DATE,
    "fecha_fin" DATE,
    "estatus" VARCHAR(20) DEFAULT 'Planificaci├│n',
    "id_usuario_creador" INTEGER,

    CONSTRAINT "proyecto_pkey" PRIMARY KEY ("id_proyecto")
);

-- CreateTable
CREATE TABLE "proyecto_participante" (
    "id_participacion" SERIAL NOT NULL,
    "id_proyecto" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "fecha_asignacion" DATE DEFAULT CURRENT_DATE,
    "activo" BOOLEAN DEFAULT true,
    "fecha_salida" DATE,

    CONSTRAINT "proyecto_participante_pkey" PRIMARY KEY ("id_participacion")
);

-- CreateTable
CREATE TABLE "rol" (
    "id_rol" SERIAL NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "estatus" CHAR(1),

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "stakeholder" (
    "id_stakeholder" SERIAL NOT NULL,
    "id_proyecto" INTEGER,
    "nombre" VARCHAR(100) NOT NULL,
    "rol" VARCHAR(50) NOT NULL,
    "area" VARCHAR(50),
    "contacto_email" VARCHAR(60),
    "notas" TEXT,

    CONSTRAINT "stakeholder_pkey" PRIMARY KEY ("id_stakeholder")
);

-- CreateTable
CREATE TABLE "subproceso" (
    "id_subproceso" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "codigo_orden" VARCHAR(10) NOT NULL,
    "id_proceso" INTEGER NOT NULL,

    CONSTRAINT "subproceso_pkey" PRIMARY KEY ("id_subproceso")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" INTEGER NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "apellido_paterno" VARCHAR(50) NOT NULL,
    "apellido_materno" VARCHAR(50),
    "telefono" INTEGER,
    "email" VARCHAR(100) NOT NULL,
    "estatus" CHAR,
    "password_hash" VARCHAR(64),
    "Nombre_usuario" VARCHAR(32),

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "equipo_proyecto" (
    "id_equipo" SERIAL NOT NULL,
    "id_proyecto" INTEGER,
    "id_usuario" INTEGER,
    "id_rol" INTEGER,

    CONSTRAINT "equipo_proyecto_pkey" PRIMARY KEY ("id_equipo")
);

-- CreateTable
CREATE TABLE "requerimiento" (
    "id_requerimiento" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "codigo_unico" VARCHAR(20) NOT NULL,
    "id_tecnica" INTEGER NOT NULL,

    CONSTRAINT "requerimiento_pkey" PRIMARY KEY ("id_requerimiento")
);

-- CreateTable
CREATE TABLE "tecnica_recoleccion" (
    "id_tecnica" SERIAL NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "detalle" TEXT,
    "codigo_orden" VARCHAR(10) NOT NULL,
    "id_subproceso" INTEGER NOT NULL,
    "id_stakeholder" INTEGER,

    CONSTRAINT "tecnica_recoleccion_pkey" PRIMARY KEY ("id_tecnica")
);

-- CreateIndex
CREATE UNIQUE INDEX "proyecto_participante_id_proyecto_id_usuario_id_rol_key" ON "proyecto_participante"("id_proyecto", "id_usuario", "id_rol");

-- CreateIndex
CREATE UNIQUE INDEX "equipo_proyecto_id_proyecto_id_usuario_id_rol_key" ON "equipo_proyecto"("id_proyecto", "id_usuario", "id_rol");

-- AddForeignKey
ALTER TABLE "proceso" ADD CONSTRAINT "proceso_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "proyecto"("id_proyecto") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyecto" ADD CONSTRAINT "proyecto_id_usuario_creador_fkey" FOREIGN KEY ("id_usuario_creador") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyecto_participante" ADD CONSTRAINT "proyecto_participante_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "proyecto"("id_proyecto") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyecto_participante" ADD CONSTRAINT "proyecto_participante_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyecto_participante" ADD CONSTRAINT "proyecto_participante_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stakeholder" ADD CONSTRAINT "stakeholder_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "proyecto"("id_proyecto") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subproceso" ADD CONSTRAINT "subproceso_id_proceso_fkey" FOREIGN KEY ("id_proceso") REFERENCES "proceso"("id_proceso") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "equipo_proyecto" ADD CONSTRAINT "equipo_proyecto_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "proyecto"("id_proyecto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "equipo_proyecto" ADD CONSTRAINT "equipo_proyecto_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "equipo_proyecto" ADD CONSTRAINT "equipo_proyecto_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requerimiento" ADD CONSTRAINT "requerimiento_id_tecnica_fkey" FOREIGN KEY ("id_tecnica") REFERENCES "tecnica_recoleccion"("id_tecnica") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tecnica_recoleccion" ADD CONSTRAINT "tecnica_id_stakeholder_fkey" FOREIGN KEY ("id_stakeholder") REFERENCES "stakeholder"("id_stakeholder") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tecnica_recoleccion" ADD CONSTRAINT "tecnica_id_subproceso_fkey" FOREIGN KEY ("id_subproceso") REFERENCES "subproceso"("id_subproceso") ON DELETE CASCADE ON UPDATE NO ACTION;

