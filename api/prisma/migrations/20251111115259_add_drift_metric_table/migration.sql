/*
  Warnings:

  - You are about to drop the column `alert_flag` on the `DriftMetric` table. All the data in the column will be lost.
  - You are about to drop the column `computed_at` on the `DriftMetric` table. All the data in the column will be lost.
  - You are about to drop the column `drift_score` on the `DriftMetric` table. All the data in the column will be lost.
  - You are about to drop the column `feature_name` on the `DriftMetric` table. All the data in the column will be lost.
  - You are about to drop the column `p_value` on the `DriftMetric` table. All the data in the column will be lost.
  - Added the required column `avg_p_value` to the `DriftMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `drift_rate` to the `DriftMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `drifted_features` to the `DriftMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_features` to the `DriftMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `window` to the `DriftMetric` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DriftMetric" DROP COLUMN "alert_flag",
DROP COLUMN "computed_at",
DROP COLUMN "drift_score",
DROP COLUMN "feature_name",
DROP COLUMN "p_value",
ADD COLUMN     "avg_p_value" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "drift_rate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "drifted_features" INTEGER NOT NULL,
ADD COLUMN     "total_features" INTEGER NOT NULL,
ADD COLUMN     "window" TEXT NOT NULL;
