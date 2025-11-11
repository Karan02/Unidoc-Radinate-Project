import { Module } from '@nestjs/common';
import { ModelsController } from './models.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ModelsController],
  providers: [PrismaService],
})
export class ModelsModule {}
