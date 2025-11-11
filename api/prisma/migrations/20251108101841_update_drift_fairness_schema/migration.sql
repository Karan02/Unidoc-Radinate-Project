/*
  Warnings:

  - You are about to drop the column `model` on the `DriftSignal` table. All the data in the column will be lost.
  - You are about to drop the column `bias_score` on the `FairnessMetric` table. All the data in the column will be lost.
  - You are about to drop the column `computed_at` on the `FairnessMetric` table. All the data in the column will be lost.
  - You are about to drop the column `delta_vs_overall` on the `FairnessMetric` table. All the data in the column will be lost.
  - You are about to drop the column `model_version` on the `FairnessMetric` table. All the data in the column will be lost.
  - Added the required column `model_name` to the `DriftSignal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `delta` to the `FairnessMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `f1_score` to the `FairnessMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precision` to the `FairnessMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recall` to the `FairnessMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `window` to the `FairnessMetric` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DriftSignal" DROP COLUMN "model",
ADD COLUMN     "model_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FairnessMetric" DROP COLUMN "bias_score",
DROP COLUMN "computed_at",
DROP COLUMN "delta_vs_overall",
DROP COLUMN "model_version",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "delta" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "f1_score" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "precision" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "recall" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "window" TEXT NOT NULL;
