import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { PrismaService } from '../prisma.service';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private prisma: PrismaService,
  ) {}

  // 🔹 Run comparison (optionally filter by model)
 /**
   * POST /jobs/compare
   * Compares AIOutput vs GroundTruth for each study
   * Computes precision, recall, F1
   */

  @Get('runs')
  @Roles('CMIO', 'Chief Risk Officer', 'Radiology Lead', 'Analyst', 'System')
  async getRuns() {
    const runs = await this.prisma.runManifest.findMany({
      orderBy: { started_at: 'desc' },
      take: 25,
    });

    return {
      count: runs.length,
      runs: runs.map((r) => ({
        id: r.id,
        job_id: r.job_id,
        run_type: r.run_type,
        model_name: r.model_name,
        model_version: r.model_version,
        status: r.status,
        started_at: r.started_at,
        completed_at: r.completed_at,
        summary: r.summary,
        error: (r.summary as any)?.error ?? null,
        stack: (r.summary as any)?.stack ?? null,

      })),
    };
  }
  
   /**
   * 🧩 New endpoint: external job ingestion (from Python)
   */
  @Post('ingest-run')
  @Roles('Analyst', 'System')
  async ingestRun(
    @Body()
    body: {
      run_type: 'comparison' | 'drift' | 'fairness';
      model_name: string;
      model_version: string;
      status: 'running' | 'success' | 'failed';
      summary?: any;
    },
  ) {
    const { run_type, model_name, model_version, status, summary } = body;

    // Basic validation
    if (!run_type || !model_name || !model_version || !status) {
      return {
        success: false,
        message: 'Missing required fields: run_type, model_name, model_version, status',
      };
    }

    const run = await this.prisma.runManifest.create({
      data: {
        run_type,
        model_name,
        model_version,
        status,
        summary: summary ?? {},
        completed_at: status !== 'running' ? new Date() : null,
      },
    });

    // Log it
    await this.prisma.auditLog.create({
      data: {
        action: `${run_type}_ingest`,
        user: 'python-script',
        entity: 'RunManifest',
        entity_id: run.id,
        timestamp: new Date(),
      },
    });

    // this.logger.log(
    //   `📥 Ingested ${run_type} run for ${model_name} (${model_version}) — status: ${status}`,
    // );

    return { success: true, run };
  }

  @Post('compare')
  @Roles('CMIO', 'Chief Risk Officer', 'Radiology Lead')
  async compareAIvsGroundTruth(
    @Body() body: { model_name: string; model_version: string },
  ) {
    const { model_name, model_version } = body;

    // Step 1️⃣ — Fetch all studies with related outputs and truths
    const studies = await this.prisma.study.findMany({
      include: {
        aiOutputs: true,
        groundTruths: true,
      },
    });

    if (!studies.length) {
      // this.logger.warn('No studies found for comparison job.');
      return { success: false, message: 'No studies found.' };
    }

    // Step 2️⃣ — Process each study
    for (const study of studies) {
      const aiFindings = new Set(study.aiOutputs.map((a) => a.finding));
      const gtFindings = new Set(study.groundTruths.map((g) => g.finding));

      const truePositives = [...aiFindings].filter((f) => gtFindings.has(f)).length;
      const falsePositives = [...aiFindings].filter((f) => !gtFindings.has(f)).length;
      const falseNegatives = [...gtFindings].filter((f) => !aiFindings.has(f)).length;

      const precision =
        truePositives + falsePositives === 0
          ? 0
          : truePositives / (truePositives + falsePositives);
      const recall =
        truePositives + falseNegatives === 0
          ? 0
          : truePositives / (truePositives + falseNegatives);
      const f1 =
        precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

      // Step 3️⃣ — Store results safely
      await this.prisma.comparisonResult.create({
        data: {
          study_id: study.id,          // ✅ FK to Study
          study_uid: study.study_uid,  // ✅ string reference
          model_name,
          model_version,
          precision: parseFloat(precision.toFixed(3)),
          recall: parseFloat(recall.toFixed(3)),
          f1_score: parseFloat(f1.toFixed(3)),
        },
      });

      // Step 4️⃣ — Add audit entry
      await this.prisma.auditLog.create({
        data: {
          action: 'compare_job',
          user: 'system',
          entity: 'ComparisonResult',
          entity_id: study.id,
          timestamp: new Date(),
        },
      });
    }

    // this.logger.log(
    //   `✅ Comparison job completed for model ${model_name} (${model_version})`,
    // );

    return { success: true, message: 'Comparison job completed.' };
  }

  // 🔹 View all historical runs
  @Get('history')
  @Roles('CMIO', 'Chief Risk Officer', 'Radiology Lead', 'Analyst', 'System')
  async getAllJobs() {
    return this.prisma.comparisonResult.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  // 🔹 View results of specific job
  @Get('history/:jobId')
  @Roles('CMIO', 'Chief Risk Officer', 'Radiology Lead', 'Analyst', 'System')
  async getJobResults(@Param('jobId') jobId: string) {
    return this.prisma.comparisonResult.findMany({
      where: { job_id: jobId },
      orderBy: { study_uid: 'asc' },
    });
  }
}
