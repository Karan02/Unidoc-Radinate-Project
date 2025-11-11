-- CreateTable
CREATE TABLE "Study" (
    "id" SERIAL NOT NULL,
    "study_uid" TEXT NOT NULL,
    "accession" TEXT,
    "patient_age" INTEGER,
    "patient_sex" TEXT,
    "site_id" TEXT,
    "scanner_make" TEXT,
    "scanner_model" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Study_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiOutput" (
    "id" SERIAL NOT NULL,
    "study_uid" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "model_version" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "pred_label" BOOLEAN NOT NULL,
    "timestamp_ai" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiOutput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroundTruth" (
    "id" SERIAL NOT NULL,
    "study_uid" TEXT NOT NULL,
    "gt_source" TEXT NOT NULL,
    "gt_label" BOOLEAN NOT NULL,
    "gt_confidence" DOUBLE PRECISION NOT NULL,
    "timestamp_gt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroundTruth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetricTimeSeries" (
    "id" SERIAL NOT NULL,
    "model" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "windowEnd" TIMESTAMP(3) NOT NULL,
    "f1" DOUBLE PRECISION,
    "auroc" DOUBLE PRECISION,
    "auprc" DOUBLE PRECISION,
    "n" INTEGER,

    CONSTRAINT "MetricTimeSeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Study_study_uid_key" ON "Study"("study_uid");

-- AddForeignKey
ALTER TABLE "AiOutput" ADD CONSTRAINT "AiOutput_study_uid_fkey" FOREIGN KEY ("study_uid") REFERENCES "Study"("study_uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroundTruth" ADD CONSTRAINT "GroundTruth_study_uid_fkey" FOREIGN KEY ("study_uid") REFERENCES "Study"("study_uid") ON DELETE RESTRICT ON UPDATE CASCADE;
