/*
  Warnings:

  - You are about to drop the column `id_proyecto` on the `stakeholder` table. All the data in the column will be lost.
  - You are about to drop the column `rol` on the `stakeholder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "stakeholder" DROP CONSTRAINT "stakeholder_id_proyecto_fkey";

-- AlterTable
ALTER TABLE "proyecto" ALTER COLUMN "estatus" SET DEFAULT 'Planificación';

-- AlterTable
ALTER TABLE "rol" ADD COLUMN     "descripcion" CHAR(200),
ADD COLUMN     "id_proyecto" INTEGER;

-- AlterTable
ALTER TABLE "stakeholder" DROP COLUMN "id_proyecto",
DROP COLUMN "rol",
ADD COLUMN     "id_rol" INTEGER;

-- CreateTable
CREATE TABLE "entrevista" (
    "id_entrevista" SERIAL NOT NULL,
    "id_tecnica" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fecha_entrevista" DATE,
    "duracion" INTEGER,
    "estatus" VARCHAR(20) NOT NULL,

    CONSTRAINT "entrevista_pkey" PRIMARY KEY ("id_entrevista")
);

-- CreateTable
CREATE TABLE "pregunta_entrevista" (
    "id_pregunta" SERIAL NOT NULL,
    "id_entrevista" INTEGER NOT NULL,
    "orden_pregunta" INTEGER NOT NULL,
    "pregunta" TEXT NOT NULL,
    "respuesta" TEXT,

    CONSTRAINT "pregunta_entrevista_pkey" PRIMARY KEY ("id_pregunta")
);

-- AddForeignKey
ALTER TABLE "rol" ADD CONSTRAINT "fk_rol_proyecto" FOREIGN KEY ("id_proyecto") REFERENCES "proyecto"("id_proyecto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stakeholder" ADD CONSTRAINT "fk_stakeholder_rol" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entrevista" ADD CONSTRAINT "entrevista_id_tecnica_fkey" FOREIGN KEY ("id_tecnica") REFERENCES "tecnica_recoleccion"("id_tecnica") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrevista" ADD CONSTRAINT "entrevista_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pregunta_entrevista" ADD CONSTRAINT "pregunta_entrevista_id_entrevista_fkey" FOREIGN KEY ("id_entrevista") REFERENCES "entrevista"("id_entrevista") ON DELETE CASCADE ON UPDATE CASCADE;
