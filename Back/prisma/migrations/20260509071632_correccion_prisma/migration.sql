/*
  Warnings:

  - You are about to drop the column `codigo_orden` on the `proceso` table. All the data in the column will be lost.
  - You are about to drop the column `notas` on the `stakeholder` table. All the data in the column will be lost.
  - You are about to drop the column `codigo_orden` on the `subproceso` table. All the data in the column will be lost.
  - Made the column `password_hash` on table `usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "tipo_diagrama" AS ENUM ('use-case', 'class', 'sequence', 'package');

-- AlterTable
ALTER TABLE "proceso" DROP COLUMN "codigo_orden",
ADD COLUMN     "estatus" VARCHAR(1) DEFAULT 'A';

-- AlterTable
ALTER TABLE "stakeholder" DROP COLUMN "notas",
ADD COLUMN     "estatus" VARCHAR(1) DEFAULT 'A';

-- AlterTable
ALTER TABLE "subproceso" DROP COLUMN "codigo_orden",
ADD COLUMN     "estatus" VARCHAR(1) NOT NULL DEFAULT 'A';

-- AlterTable
CREATE SEQUENCE usuario_id_usuario_seq;
ALTER TABLE "usuario" ALTER COLUMN "id_usuario" SET DEFAULT nextval('usuario_id_usuario_seq'),
ALTER COLUMN "password_hash" SET NOT NULL;
ALTER SEQUENCE usuario_id_usuario_seq OWNED BY "usuario"."id_usuario";

-- CreateTable
CREATE TABLE "diagrama_uml" (
    "id_diagrama" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(150) NOT NULL,
    "tipo_diagrama" "tipo_diagrama",
    "diagrama" TEXT,
    "estatus" VARCHAR(1) NOT NULL DEFAULT 'A',
    "id_proyecto" INTEGER,

    CONSTRAINT "diagrama_uml_pkey" PRIMARY KEY ("id_diagrama")
);

-- CreateTable
CREATE TABLE "observacion" (
    "id_observacion" SERIAL NOT NULL,
    "id_tecnica" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fecha" DATE,
    "nota" TEXT NOT NULL,
    "tipo_observacion" VARCHAR(30) NOT NULL,
    "tipo_hallazgo" VARCHAR(20),
    "impacto" VARCHAR(10),

    CONSTRAINT "observacion_pkey" PRIMARY KEY ("id_observacion")
);

-- AddForeignKey
ALTER TABLE "diagrama_uml" ADD CONSTRAINT "diagrama_uml_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "proyecto"("id_proyecto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "observacion" ADD CONSTRAINT "fk_observacion_tecnica" FOREIGN KEY ("id_tecnica") REFERENCES "tecnica_recoleccion"("id_tecnica") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "observacion" ADD CONSTRAINT "fk_observacion_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;
