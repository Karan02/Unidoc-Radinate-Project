import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('fairness')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FairnessController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':id')
  @Roles('CMIO','Chief Risk Officer', 'CFO')
  async getFairness(
    @Param('id') id: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const [model_name, model_version] = id.split(':');

    const where: any = { model_name };
    if (model_version) where.model_version = model_version;
    if (from && to) where.computed_at = { gte: new Date(from), lte: new Date(to) };

    const records = await this.prisma.fairnessMetric.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    const avgBias =
      records.length > 0
        ? Number(
            (
              records.reduce((sum, r) => sum + r.delta, 0) / records.length
            ).toFixed(3),
          )
        : null;

    return {
      model_name,
      model_version,
      avg_bias: avgBias,
      subgroups: records,
    };
  }
}
