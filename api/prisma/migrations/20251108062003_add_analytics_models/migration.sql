-- CreateTable
CREATE TABLE "RunManifest" (
    "id" SERIAL NOT NULL,
    "job_id" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "model_version" TEXT NOT NULL,
    "run_type" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "summary" JSONB,

    CONSTRAINT "RunManifest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetricsTimeSeries" (
    "id" SERIAL NOT NULL,
    "model_name" TEXT NOT NULL,
    "model_version" TEXT NOT NULL,
    "metric_name" TEXT NOT NULL,
    "metric_value" DOUBLE PRECISION NOT NULL,
    "computed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MetricsTimeSeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriftMetric" (
    "id" SERIAL NOT NULL,
    "model_name" TEXT NOT NULL,
    "model_version" TEXT NOT NULL,
    "feature_name" TEXT NOT NULL,
    "drift_score" DOUBLE PRECISION NOT NULL,
    "p_value" DOUBLE PRECISION,
    "alert_flag" BOOLEAN NOT NULL DEFAULT false,
    "computed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DriftMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FairnessMetric" (
    "id" SERIAL NOT NULL,
    "model_name" TEXT NOT NULL,
    "model_version" TEXT NOT NULL,
    "subgroup" TEXT NOT NULL,
    "bias_score" DOUBLE PRECISION NOT NULL,
    "delta_vs_overall" DOUBLE PRECISION NOT NULL,
    "computed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FairnessMetric_pkey" PRIMARY KEY ("id")
);
