import {
  Controller,
  Post,
  Res,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import * as fs from 'fs';
import * as path from 'path';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exports')
export class ExportsController {
  private readonly logger = new Logger(ExportsController.name);

  /**
   * POST /exports/monthly-pack
   * Export metrics (CSV) + metadata into a downloadable ZIP
   * Access: CMIO, Chief Risk Officer, CFO
   */
  @Roles('CMIO', 'Chief Risk Officer', 'CFO')
  @Post('monthly-pack')
  async exportMonthlyPack(@Res() res: Response) {
    const records = await this.prisma.metricsTimeSeries.findMany({
      orderBy: { computed_at: 'desc' },
    });

    if (!records.length) {
      res.status(404).send('No metrics data available.');
      return;
    }

    // Flatten each record into multiple metric rows for CSV
    const csvRows = [
      'model_name,model_version,metric_name,metric_value,computed_at',
    ];

    records.forEach((m) => {
      const metricEntries = {
        precision: m.precision,
        recall: m.recall,
        f1_score: m.f1_score,
        auc_roc: m.auc_roc,
        auc_pr: m.auc_pr,
        ppv: m.ppv,
        npv: m.npv,
        prevalence: m.prevalence,
        ece: m.ece,
      };

      for (const [metricName, metricValue] of Object.entries(metricEntries)) {
        if (metricValue != null) {
          csvRows.push(
            `${m.model_name},${m.model_version},${metricName},${metricValue},${m.computed_at.toISOString()}`
          );
        }
      }
    });

    const csvData = csvRows.join('\n');

    // Save temporarily before sending
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    const filePath = path.join(tmpDir, `metrics_${Date.now()}.csv`);

    fs.writeFileSync(filePath, csvData);
    this.logger.log(`✅ Export generated: ${filePath}`);

    res.download(filePath, 'metrics_export.csv', () => {
      fs.unlinkSync(filePath);
    });
  }

  constructor(private readonly prisma: PrismaService) {}
}
