import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AiController],
  providers: [PrismaService],
})
export class AiModule {}
