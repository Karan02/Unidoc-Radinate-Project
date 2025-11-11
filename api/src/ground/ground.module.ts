import { Module } from '@nestjs/common';
import { GroundController } from './ground.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [GroundController],
  providers: [PrismaService],
})
export class GroundModule {}
