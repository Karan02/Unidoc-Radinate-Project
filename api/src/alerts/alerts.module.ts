import { Module } from '@nestjs/common';
import { AlertsController } from './alerts.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AlertsController],
  providers: [PrismaService],
})
export class AlertsModule {}
