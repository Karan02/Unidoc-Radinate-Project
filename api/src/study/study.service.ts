import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StudyService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.study.findMany({
      include: {
        aiOutputs: true,
        groundTruths: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async findById(id: number) {
    return this.prisma.study.findUnique({
      where: { id },
      include: {
        aiOutputs: true,
        groundTruths: true,
      },
    });
  }
}
