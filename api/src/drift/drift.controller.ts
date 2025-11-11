// import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
// import { PrismaService } from '../prisma.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';

// @Controller('drift')
// @UseGuards(JwtAuthGuard, RolesGuard)
// export class DriftController {
//   constructor(private readonly prisma: PrismaService) {}

//   @Get(':id')
//   @Roles('Chief Risk Officer', 'CMIO')
//   async getDrift(
//     @Param('id') id: string,
//     @Query('from') from?: string,
//     @Query('to') to?: string,
//   ) {
//     const [model_name, model_version] = id.split(':');

//     const where: any = { model_name };
//     if (model_version) where.model_version = model_version;
//     if (from && to) where.computed_at = { gte: new Date(from), lte: new Date(to) };

//     const driftRecords = await this.prisma.driftMetric.findMany({
//       where,
//       orderBy: { created_at: 'desc' },
//     });

//     return {
//       model_name,
//       model_version,
//       drift: driftRecords,
//       // alerts: driftRecords.filter((d) => d.alert_flag),
//     };
//   }
// }

import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard'; // ✅ ensure it's 'role.guard.ts'
import { Roles } from '../auth/roles.decorator';

@Controller('drift')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DriftController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /drift/:id
   * Combines DriftMetric (summary) and DriftSignal (details)
   * Example: GET /drift/AIModel-X:v1.0?from=2025-10-01&to=2025-11-01
   * Access: CMIO, Chief Risk Officer
   */
  @Roles('CMIO', 'Chief Risk Officer')
  @Get(':id')
  async getDrift(
    @Param('id') id: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const [model_name, model_version] = id.split(':');

    // Filter for drift metrics (summary)
    const metricWhere: any = { model_name };
    if (model_version) metricWhere.model_version = model_version;
    if (from && to)
      metricWhere.created_at = {
        gte: new Date(from),
        lte: new Date(to),
      };

    // Filter for drift signals (feature-level)
    const signalWhere: any = { model_name };
    if (from && to)
      signalWhere.created_at = {
        gte: new Date(from),
        lte: new Date(to),
      };

    // Query both DriftMetric (summary) and DriftSignal (features)
    const [metrics, signals] = await Promise.all([
      this.prisma.driftMetric.findMany({
        where: metricWhere,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.driftSignal.findMany({
        where: signalWhere,
        orderBy: { created_at: 'desc' },
      }),
    ]);

    // Derive drift summary info for the frontend
    const driftRate =
      metrics.length > 0
        ? metrics[0].drift_rate
        : signals.filter((s) => s.status === 'drifted').length /
          (signals.length || 1);

    const driftedFeatures = signals
      .filter((s) => s.status === 'drifted')
      .map((s) => s.feature);

    return {
      model_name,
      model_version,
      drift_rate: parseFloat(driftRate.toFixed(3)),
      total_features: signals.length,
      drifted_features: driftedFeatures.length,
      drifted_features_list: driftedFeatures,
      summary: metrics,
      signals,
    };
  }
}
