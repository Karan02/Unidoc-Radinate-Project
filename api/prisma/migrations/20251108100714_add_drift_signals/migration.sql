-- CreateTable
CREATE TABLE "DriftSignal" (
    "id" SERIAL NOT NULL,
    "model" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "p_value" DOUBLE PRECISION NOT NULL,
    "diff" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "window" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DriftSignal_pkey" PRIMARY KEY ("id")
);
