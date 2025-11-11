import { Controller, Post, Body, ConflictException, NotFoundException } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '../prisma.service';

// Zod validation schema
const GroundTruthSchema = z.object({
  study_uid: z.string(), // ✅ match Study schema
  gt_source: z.string(),
  gt_label: z.boolean(),
  gt_confidence: z.number().min(0).max(1),
  timestamp_gt: z.string().datetime(),
});

@Controller('ingest')
export class GroundController {
  constructor(private prisma: PrismaService) {}

  @Post('ground-truth')
  async ingestGroundTruth(@Body() data: unknown) {
    const parsed = GroundTruthSchema.parse(data);

    // 1️⃣ Find study
    const study = await this.prisma.study.findUnique({
      where: { study_uid: parsed.study_uid },
    });

    if (!study) {
      throw new NotFoundException(`Study with UID ${parsed.study_uid} not found`);
    }

    // 2️⃣ Check duplicate
    const existing = await this.prisma.groundTruth.findFirst({
      where: {
        study_id: study.id,
        finding: parsed.gt_source,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Ground truth for study ${parsed.study_uid} and source ${parsed.gt_source} already exists.`,
      );
    }

    // 3️⃣ Insert record
    const groundTruth = await this.prisma.groundTruth.create({
      data: {
        study_id: study.id,
        finding: parsed.gt_source,
        created_at: new Date(parsed.timestamp_gt),
      },
    });

    // 4️⃣ Log
    await this.prisma.auditLog.create({
      data: {
        user: 'system',
        action: 'ingest_ground_truth',
        entity: 'GroundTruth',
        entity_id: groundTruth.id,
      },
    });

    return { success: true, id: groundTruth.id };
  }
}
