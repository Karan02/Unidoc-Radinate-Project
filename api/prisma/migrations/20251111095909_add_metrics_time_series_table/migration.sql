/*
  Warnings:

  - You are about to drop the column `metric_name` on the `MetricsTimeSeries` table. All the data in the column will be lost.
  - You are about to drop the column `metric_value` on the `MetricsTimeSeries` table. All the data in the column will be lost.
  - Added the required column `f1_score` to the `MetricsTimeSeries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precision` to the `MetricsTimeSeries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recall` to the `MetricsTimeSeries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `window` to the `MetricsTimeSeries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MetricsTimeSeries" DROP COLUMN "metric_name",
DROP COLUMN "metric_value",
ADD COLUMN     "auc_pr" DOUBLE PRECISION,
ADD COLUMN     "auc_roc" DOUBLE PRECISION,
ADD COLUMN     "ece" DOUBLE PRECISION,
ADD COLUMN     "f1_score" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "n" INTEGER,
ADD COLUMN     "npv" DOUBLE PRECISION,
ADD COLUMN     "ppv" DOUBLE PRECISION,
ADD COLUMN     "precision" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "prevalence" DOUBLE PRECISION,
ADD COLUMN     "recall" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "window" TEXT NOT NULL;
