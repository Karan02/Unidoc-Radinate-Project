import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('models')
export class ModelsController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /models
   * List all available models with latest health/last-run info.
   * Access: CMIO, Chief Risk Officer, Radiology Lead, CFO
   */
  @Roles('CMIO', 'Chief Risk Officer', 'Radiology Lead', 'CFO')
  @Get()
  async listModels() {
    const models = await this.prisma.metricsTimeSeries.findMany({
      distinct: ['model_name', 'model_version'],
      orderBy: { computed_at: 'desc' },
    });

    // Summarize last-run info
    return models.map((m) => ({
      model_name: m.model_name,
      model_version: m.model_version,
      last_run: m.computed_at,
      precision:m.precision,
      recall:m.recall,
      f1_score:m.f1_score,
      // auc_roc:m.auc_roc,
      // auc_pr:m.auc_pr,
      // ppv:m.ppv,
      // npv:m.npv,
      // prevalence:m.prevalence,
      // ece:m.ece,
      
    }));
  }
  /**
   * GET /models/:id/metrics?from=&to=&slice=
   * Fetch model-specific metrics and snapshot data.
   * Access: CMIO, Chief Risk Officer, Radiology Lead
   */
  @Roles('CMIO', 'Chief Risk Officer', 'Radiology Lead')
  @Get(':id/metrics')
  async getMetrics(
    @Param('id') id: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('slice') slice?: string,
  ) {
    const [model_name, model_version] = id.split(':');
    const where: any = { model_name };

    if (model_version) where.model_version = model_version;
    if (from && to)
      where.computed_at = {
        gte: new Date(from),
        lte: new Date(to),
      };

    const metrics = await this.prisma.metricsTimeSeries.findMany({
      where,
      orderBy: { computed_at: 'asc' },
    });

    // Example snapshot (replace later with real metrics)
    const confusionSnapshot = {
      tp: Math.floor(Math.random() * 100),
      fp: Math.floor(Math.random() * 10),
      fn: Math.floor(Math.random() * 10),
      tn: Math.floor(Math.random() * 80),
    };

    return {
      model_name,
      model_version,
      metrics,
      confusion_snapshot: confusionSnapshot,
    };
  }
}
