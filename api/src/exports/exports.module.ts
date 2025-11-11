import { Module } from '@nestjs/common';
import { ExportsController } from './exports.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ExportsController],
  providers: [PrismaService],
})
export class ExportsModule {}
