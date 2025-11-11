import { Module } from '@nestjs/common';
import { FairnessController } from './fairness.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [FairnessController],
  providers: [PrismaService],
})
export class FairnessModule {}
