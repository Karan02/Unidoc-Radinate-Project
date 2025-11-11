import { Module } from '@nestjs/common';
import { StudyController } from './study.controller';
import { StudyService } from './study.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [StudyController],
  providers: [StudyService, PrismaService],
})
export class StudyModule {}
