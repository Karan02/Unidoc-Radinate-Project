import { Module } from '@nestjs/common';
import { RBACController } from './rbac.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [RBACController],
  providers: [PrismaService],
})
export class RBACModule {}
