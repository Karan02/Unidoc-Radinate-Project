import { Module } from '@nestjs/common';
import { DriftController } from './drift.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DriftController],
  providers: [PrismaService],
})
export class DriftModule {}
