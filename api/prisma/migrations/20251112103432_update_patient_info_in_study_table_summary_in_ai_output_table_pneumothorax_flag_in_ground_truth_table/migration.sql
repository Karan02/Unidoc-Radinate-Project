-- AlterTable
ALTER TABLE "AIOutput" ADD COLUMN     "summary" TEXT;

-- AlterTable
ALTER TABLE "GroundTruth" ADD COLUMN     "pneumothorax_flag" INTEGER;

-- AlterTable
ALTER TABLE "Study" ADD COLUMN     "patient_ethnicity" TEXT,
ADD COLUMN     "patient_id" TEXT,
ADD COLUMN     "patient_race" TEXT;
