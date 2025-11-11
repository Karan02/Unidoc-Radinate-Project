-- CreateTable
CREATE TABLE "ComparisonResult" (
    "id" SERIAL NOT NULL,
    "job_id" TEXT NOT NULL,
    "study_uid" TEXT NOT NULL,
    "precision" DOUBLE PRECISION NOT NULL,
    "recall" DOUBLE PRECISION NOT NULL,
    "f1_score" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComparisonResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ComparisonResult" ADD CONSTRAINT "ComparisonResult_study_uid_fkey" FOREIGN KEY ("study_uid") REFERENCES "Study"("study_uid") ON DELETE RESTRICT ON UPDATE CASCADE;
