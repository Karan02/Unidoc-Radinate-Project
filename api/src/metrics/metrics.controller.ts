import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('metrics')
export class MetricsController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /metrics/timeseries
   * Fetch metrics time series for a specific model and optional date range.
   * 
   * Access: CMIO, Chief Risk Officer, Radiology Lead
   * 
   * Example:
   * GET /metrics/timeseries?model=AIModel-X&from=2025-10-01&to=2025-11-01
   */
  @Roles('CMIO', 'Chief Risk Officer', 'Radiology Lead')
  @Get('timeseries')
  async getMetricsTimeSeries(
    @Query('model') model?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const where: any = {};

    if (model) where.model_name = model;
    if (from && to)
      where.computed_at = {
        gte: new Date(from),
        lte: new Date(to),
      };

    const records = await this.prisma.metricsTimeSeries.findMany({
      where,
      orderBy: { computed_at: 'asc' },
    });

    return {
      count: records.length,
      data: records,
    };
  }
}