import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('alerts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AlertsController {
  private readonly logger = new Logger(AlertsController.name);

  constructor(private readonly prisma: PrismaService) {}

  // List alerts (Chief Risk Officer + CMIO)
  @Get()
  @Roles('Chief Risk Officer', 'CMIO', 'Radiology Lead')
  async listAlerts(@Query('severity') severity?: string) {
    const where: any = {};
    if (severity) where.severity = severity;

    const alerts = await this.prisma.alert.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });
    return { count: alerts.length, alerts };
  }

  // Create new alert (Chief Risk Officer only)
  @Post()
  @Roles('Chief Risk Officer')
  async createAlert(
    @Body()
    body: {
      type: string;
      message: string;
      severity?: string;
    },
  ) {
    const alert = await this.prisma.alert.create({
      data: {
        type: body.type,
        message: body.message,
        severity: body.severity ?? 'info',
      },
    });

    this.logger.log(`New alert created: ${alert.type} - ${alert.message}`);
    return { success: true, alert };
  }

  // Send test alert (Chief Risk Officer + CMIO)
  @Post('test')
  @Roles('Chief Risk Officer', 'CMIO', 'Radiology Lead')
  async sendTestAlert() {
    const testAlert = await this.prisma.alert.create({
      data: {
        type: 'system',
        message: 'This is a test alert from Radinate API',
        severity: 'info',
      },
    });

    this.logger.log('Test alert sent.');
    return { success: true, alert: testAlert };
  }
}
